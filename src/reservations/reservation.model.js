'use strict';

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "User Id is required"]
        },

        restaurantId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: [true, "restaurante Id is required"]
        },

        tableId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: [true, "mesa Id is required"]
        },

        numberPeople:{
            type: Number,
            required: [true, "Number of people is required"]
        },

        typeReservation:{
            type: String,
            enum: ["PERSONAL", "EVENTO"],
            required: [true, "Type of reservation is required (PERSONAL, EVENTO)"]
        },

        status:{
            type: String,
            enum: ["COMPLETADO", "PENDIENTE", "CANCELADO"],
            default: "PENDIENTE"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

reservationSchema.index({ userId: 1});
export default mongoose.model("Reservation", reservationSchema);
