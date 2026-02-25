'use strict'

import mongoose from 'mongoose'
import Order from './order.model.js'

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, tableId, items, total, adminId } = req.body

    const order = new Order({
      restaurantId,
      tableId: tableId || null,
      items,
      total: total || 0,
      adminId: adminId || null
    })

    await order.save()
    return res.status(201).json({ success: true, message: 'Order created successfully', order })
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
    const orders = await Order.find({ restaurantId }).populate('items').populate('tableId')

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
