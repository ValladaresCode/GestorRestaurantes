'use strict'
 
import { Router } from 'express'
import {
    createOrder,
    getOrdersByRestaurant,
    updateOrderStatus
} from './order.controller.js'
import { uploadFieldImage } from '../../middlewares/file-uploader.js'
import { validateCreateOrder, validateOrderStatus } from '../../middlewares/validateOrders.js'
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js'
 
const router = Router()
 
// Crear orden (solo ADMIN)
router.post('/', validateJWT, isAdmin, uploadFieldImage.none(), validateCreateOrder, createOrder)
 
// Obtener órdenes por restaurante (solo ADMIN)
router.get('/restaurant/:restaurantId', validateJWT, isAdmin, getOrdersByRestaurant)
 
// Actualizar estado de orden (solo ADMIN)
router.put('/status/:id', validateJWT, isAdmin, validateOrderStatus, updateOrderStatus)
 
export default router