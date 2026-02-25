'use strict'
 
import { Router } from 'express'
import {
    createReservation,
    getMyReservations,
    updateReservationStatus
} from './reservation.controller.js'
import { uploadFieldImage } from '../../middlewares/file-uploader.js'
import { createReservationValidator, updateReservationStatusValidator } from '../../middlewares/validateReservations.js'
 
//import { validateJwt } from '../middlewares/validate-jwt.js' // ajusta la ruta si es diferente
 
const router = Router()
 
// Crear reservación (usuario autenticado)
router.post('/create', uploadFieldImage.single("photo"), createReservationValidator, createReservation)
router.get('/my-reservations', getMyReservations)
router.put('/status/:id', updateReservationStatusValidator, updateReservationStatus)
 
export default router;