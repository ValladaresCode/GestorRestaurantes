'use strict';

import mongoose from 'mongoose';
import Menu from '../src/menus/menu.model.js';
import Restaurant from '../src/restaurants/restaurant.model.js';
import Table from '../src/tables/table.model.js';

const parseItems = (rawItems) => {
    if (Array.isArray(rawItems)) return rawItems.filter(Boolean);
    if (typeof rawItems === 'string') {
        try {
            const parsed = JSON.parse(rawItems);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch (err) {
            return rawItems.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return rawItems ? [rawItems] : [];
    }
    return [];
};

export const validateCreateOrder = async (req, res, next) => {
    try {
        const { restaurantId, tableId } = req.body || {};
        const items = parseItems(req.body?.items);

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(String(restaurantId))) {
            return res.status(400).json({ success: false, message: 'restaurantId es obligatorio y debe ser válido' });
        }

        const restaurantExists = await Restaurant.exists({ _id: restaurantId });
        if (!restaurantExists) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        if (tableId) {
            if (!mongoose.Types.ObjectId.isValid(String(tableId))) {
                return res.status(400).json({ success: false, message: 'tableId no es válido' });
            }
            const tableExists = await Table.exists({ _id: tableId, tableActive: true });
            if (!tableExists) {
                return res.status(404).json({ success: false, message: 'Mesa no encontrada o inactiva' });
            }
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Debes enviar al menos un menú en items' });
        }

        for (const id of items) {
            if (!mongoose.Types.ObjectId.isValid(String(id))) {
                return res.status(400).json({ success: false, message: `Id de menú inválido: ${id}` });
            }
        }

        const menus = await Menu.find({ _id: { $in: items }, menuActive: true });
        if (menus.length !== items.length) {
            return res.status(404).json({ success: false, message: 'Uno o más menús no existen o están inactivos' });
        }

        const restaurantMismatch = menus.find((m) => String(m.restaurantId) !== String(restaurantId));
        if (restaurantMismatch) {
            return res.status(400).json({ success: false, message: 'Todos los menús deben pertenecer al restaurante indicado' });
        }

        const total = menus.reduce((sum, menu) => sum + Number(menu.menuPrice || 0), 0);

        req.body.restaurantId = String(restaurantId);
        req.body.tableId = tableId ? String(tableId) : null;
        req.body.items = items.map((id) => String(id));
        req.body.total = total;
        req.body.adminId = req.adminId || null;

        return next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al validar la orden', error: error.message });
    }
};

export const validateOrderStatus = (req, res, next) => {
    const { status } = req.body || {};
    if (!['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(status)) {
        return res.status(400).json({ success: false, message: 'status inválido' });
    }
    return next();
};
