'use strict'

import { Router } from 'express'
import { 
    createReservation,
    getMyReservations,
    updateReservationStatus
} from './reservation.controller.js'
import { uploadFieldImage } from '../../middlewares/file-uploader.js'
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js'
import { validateCreateReservation, validateReservationStatus } from '../../middlewares/validateReservations.js'

//import { validateJwt } from '../middlewares/validate-jwt.js' // ajusta la ruta si es diferente

const router = Router()

// Crear reservación (usuario autenticado)
router.post('/create', validateJWT, uploadFieldImage.single("photo"), validateCreateReservation, createReservation)
router.get('/my-reservations', validateJWT, getMyReservations)
router.put('/status/:id', validateJWT, isAdmin, validateReservationStatus, updateReservationStatus)

export default router;