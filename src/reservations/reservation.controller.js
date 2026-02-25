'use strict'

import Reservation from './reservation.model.js'
import { v2 as cloudinary } from 'cloudinary'

/**
 * Crear reservación (usuario autenticado)
 */

export const createReservation = async (req, res) => {
    try {

        // build reservation data from body; if multer uploaded a file, attach its path
        const reservationData = { ...(req.body || {}) };
        if (req.file) {
            reservationData.photo = req.file.path; // Cloudinary URL
        }

        const reservation = new Reservation(reservationData);

        await reservation.save()

        return res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            reservation
        })

    } catch (err) {
        console.error(err)

        // Si hay error al guardar, borrar imagen subida
        if (req.file) {
            try {
                // req.file.filename es usualmente el public_id en storage cloudinary
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (elimErr) {
                console.error('Error eliminando imagen fallida', elimErr);
            }
        }

        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


/**
 * Listar MIS reservaciones (usuario normal)
 */
export const getMyReservations = async (req, res) => {
    try {

        const reservations = await Reservation.find({ userId: req.user.uid })
            .populate('restaurantId')
            .populate('tableId')

        return res.status(200).json({
            success: true,
            reservations
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Error getting reservations',
            err
        })
    }
}


/**
 * Cambiar estado (SOLO ADMIN)
 */
export const updateReservationStatus = async (req, res) => {
    try {

        const { id } = req.params
        const { status } = req.body

        if (!['COMPLETADO', 'CANCELADO'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            })
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Reservation status updated',
            reservation
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Error updating reservation',
            err
        })
    }
}