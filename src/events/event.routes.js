'use strict'

import { Router } from 'express'
import { 
    createEvent,
    getEventsByReservation,
    deactivateEvent
} from './event.controller.js'

// Si querés mejor práctica, después te explico cómo moverlo a middlewares globales

const router = Router()

/**
 * Crear evento
 * Usuario autenticado
 */
router.post(
    '/create',
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