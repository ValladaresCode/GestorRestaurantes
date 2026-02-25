'use strict'

import { Router } from 'express'
import {
    createOrder,
    getOrdersByRestaurant,
    updateOrderStatus
} from './order.controller.js'
import { uploadFieldImage } from '../../middlewares/file-uploader.js'
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js'
import { validateCreateOrder, validateOrderStatus } from '../../middlewares/validateOrders.js'

const router = Router()

// Crear orden (ADMIN)
router.post('/', validateJWT, isAdmin, uploadFieldImage.none(), validateCreateOrder, createOrder)

// Obtener órdenes por restaurante (ADMIN)
router.get('/restaurant/:restaurantId', validateJWT, isAdmin, getOrdersByRestaurant)

// Actualizar estado de orden (ADMIN)
router.put('/status/:id', validateJWT, isAdmin, validateOrderStatus, updateOrderStatus)

export default router
