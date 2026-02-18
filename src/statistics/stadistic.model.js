'use strict';

import mongoose from 'mongoose';

const stadisticSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant Id is required"]
        },

        orders:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: [true, "Orders Id is required"]
            }
        ],

        totalSales:{
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

stadisticSchema.index({ restaurantId: 1 });
export default mongoose.model("Stadistic", stadisticSchema);