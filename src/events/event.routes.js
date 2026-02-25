'use strict'

import { Router } from 'express'
import { 
    createEvent,
    getEventsByReservation,
    deactivateEvent
} from './event.controller.js'

import { validateJwt } from '../middlewares/validate-jwt.js'
import { isAdmin } from '../reservations/reservation.middleware.js' 
// Si querés mejor práctica, después te explico cómo moverlo a middlewares globales

const router = Router()

/**
 * Crear evento
 * Usuario autenticado
 */
router.post(
    '/',
    validateJwt,
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