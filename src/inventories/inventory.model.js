'use strict';

import mongoose from 'mongoose';

const iventorySchema = new mongoose.Schema(
    {
        materialName: {
            type: String,
            required: [true, "material is required"]
        },

        materialPrice: {
            type: Number,
            required: [true, "precio de material is required"],
            min: [0.01, "materialPrice debe ser mayor a 0"]
        },

        materialCategory: {
            type: String,
            enum: ["VERDURAS", "FRUTAS", "CARNES", "LIMPIEZA", "REFRIGERADOS", "OTROS"],
            required: [true, "material category is required(VERDURAS, FRUTAS, CARNES, LIMPIEZA, REFRIGERADOS, OTROS)"]
        },

        productPhoto: {
            type: String,
            default: null
        },

        cantidad: {
            type: Number,
            required: [true, "cantidad es obligatoria"],
            min: [1, "cantidad debe ser mayor o igual a 1"]
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

iventorySchema.index({available: 1});
iventorySchema.index({materialCategory: 1});
iventorySchema.index({available: 1, materialCategory: 1});
export default mongoose.model("Inventory", iventorySchema);