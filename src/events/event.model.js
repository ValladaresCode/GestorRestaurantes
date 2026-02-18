'use strict';

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            required: [true, "Reservation Id is required"]
        },
        description: {
            type: String
        },
        photo: {
            type: String,
            default: null
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"]
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"]
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

eventSchema.index({ reservationId: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ reservationId: 1, isActive: 1 });
export default mongoose.model("Event", eventSchema);