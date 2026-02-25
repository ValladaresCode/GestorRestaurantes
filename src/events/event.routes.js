"use strict"

import { Router } from 'express'
import {
    createEvent,
    getEventsByReservation,
    deactivateEvent
} from './event.controller.js'

import { uploadFieldImage } from '../../middlewares/file-uploader.js'

const router = Router()

/**
 * Crear evento
 * Usuario autenticado
 */
router.post(
    '/',
    // accept form-data without files so req.body is populated for both JSON and form-data clients
    uploadFieldImage.none(),
    createEvent
)

/**
 * Obtener eventos por reservación
 */
router.get(
    '/reservation/:reservationId',
    getEventsByReservation
)

/**
 * Desactivar evento (solo ADMIN)
 */
router.put(
    '/deactivate/:id',
    deactivateEvent
)

export default router