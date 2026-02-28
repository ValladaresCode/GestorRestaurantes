'use strict'

import mongoose from 'mongoose'
import Order from './order.model.js'
import Menu from '../menus/menu.model.js'
import { changeStock } from '../inventory/inventory.controller.js';
import { createInvoiceFromOrder } from '../invoices/invoice.controller.js';

export const createOrder = async (req, res) => {
  try {
    let { restaurantId, tableId, items, adminId, orderType = 'EN_RESTAURANTE', deliveryAddress } = req.body

    const actorId = req.adminId || adminId || null

    // Normalize items if sent as stringified JSON or comma separated
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items)
      } catch (_err) {
        // fallback to comma-separated ids without quantities
        items = items.split(',').map(id => ({ menuId: id.trim(), quantity: 1 }))
      }
    }

    const normalizedItems = (items || []).map(item => ({
      menuId: item.menuId || item.id || item._id || item,
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1
    }))

    // Calculate total price based on menu items
    let total = 0
    let itemsWithPrice = []
    if (normalizedItems && normalizedItems.length > 0) {
      const menuIds = normalizedItems.map(item => item.menuId)
      const menuItems = await Menu.find({ _id: { $in: menuIds } })

      // Create a map for quick access to prices
      const priceMap = {}
      menuItems.forEach(menu => {
        priceMap[menu._id.toString()] = menu.menuPrice
      })

      itemsWithPrice = normalizedItems.map(item => {
        const price = priceMap[item.menuId] || 0
        const lineTotal = price * item.quantity
        total += lineTotal
        return {
          menuId: item.menuId,
          quantity: item.quantity,
          price
        }
      })
    }

    // Ensure delivery address only when needed
    const shouldRequireAddress = orderType === 'A_DOMICILIO'
    if (shouldRequireAddress && !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'deliveryAddress is required for delivery orders' })
    }

    // Clear tableId for non dine-in orders
    const resolvedTableId = orderType === 'EN_RESTAURANTE' ? (tableId || null) : null

    // decrement inventory before persisting the order
    try {
      for (const item of itemsWithPrice) {
        await changeStock(item.menuId, restaurantId, -item.quantity);
      }
    } catch (stockErr) {
      if (stockErr.message === 'Stock insuficiente') {
        return res.status(400).json({ success: false, message: 'Stock insuficiente para uno de los artículos' });
      }
      throw stockErr;
    }

    const order = new Order({
      restaurantId,
      tableId: resolvedTableId,
      items: itemsWithPrice,
      total,
      adminId: actorId,
      orderType,
      deliveryAddress: shouldRequireAddress ? deliveryAddress : null
    })

    const savedOrder = await order.save()

    // generate invoice document (non‑blocking)
    try {
      const invoice = await createInvoiceFromOrder(savedOrder);
      // optionally link invoice to order
      savedOrder.invoiceId = invoice._id;
      await savedOrder.save();
    } catch (invErr) {
      console.error('Error generating invoice:', invErr);
    }

    return res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Error creating order', error: err && err.message ? err.message : String(err), stack: process.env.NODE_ENV === 'development' ? err.stack : undefined })
  }
}

export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params
    if (!restaurantId) {
      return res.status(400).json({ success: false, message: 'restaurantId is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(String(restaurantId))) {
      return res.status(400).json({ success: false, message: 'restaurantId is not a valid id' })
    }
    const orders = await Order.find({ restaurantId })
      .populate('items.menuId')
      .populate('tableId')

    return res.status(200).json({ success: true, orders })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Error getting orders', error: err && err.message ? err.message : String(err) })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    return res.status(200).json({ success: true, message: 'Order status updated', order })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Error updating order', error: err && err.message ? err.message : String(err) })
  }
}

export default {
  createOrder,
  getOrdersByRestaurant,
  updateOrderStatus
}


