'use strict'

import Reservation from './reservation.model.js'

/**
 * Crear reservación (usuario autenticado)
 */

export const createReservation = async (req, res) => {
    try {

        const {
            restaurantId,
            tableId,
            numberPeople,
            typeReservation,
            description,
            startDate,
            endDate,
            photo
        } = req.body

        const reservation = new Reservation({
            restaurantId,
            tableId,
            numberPeople,
            typeReservation,
            description,
            startDate,
            endDate,
            photo
        })

        await reservation.save()

        return res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            reservation
        })

    } catch (err) {
        console.error(err)

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