'use strict';

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        adminId: {
            type: String,
        },

        restaurantId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: [true, "restaurant Id is required"]
        },

        tableId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            default: null
        },

        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: [true, "Menu/s id is required"]
            }
        ],

        total:{
            type: Number,
            default: 0
        },

        status:{
            type: String,
            enum: ["PENDIENTE", "ENTREGADO", "CANCELADO"],
            default: "PENDIENTE"
        }
          
    },
    {
        timestamps: true,
        versionKey: false
    }
)

orderSchema.index({ restaurantId: 1 });
orderSchema.index({ status: 1 });
export default mongoose.model("Order", orderSchema);