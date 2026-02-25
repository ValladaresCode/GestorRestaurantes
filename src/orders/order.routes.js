'use strict'

import { Router } from 'express'
import {
    createOrder,
    getOrdersByRestaurant,
    updateOrderStatus
} from './order.controller.js'
import { uploadFieldImage } from '../../middlewares/file-uploader.js'

const router = Router()

// Crear orden (accept JSON or form-data without files)
router.post('/', uploadFieldImage.none(), createOrder)

// Obtener órdenes por restaurante
router.get('/restaurant/:restaurantId', getOrdersByRestaurant)

// Actualizar estado de orden
router.put('/status/:id', updateOrderStatus)

export default router
