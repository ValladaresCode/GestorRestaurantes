'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        userNombre: {
            type: String,
            required: [true, "nombre is required"],
            trim: true,
            maxlength: [50, "nombre no puede ser más de 50 characters"]
        },

        userApellido: {
            type: String,
            required: [true, "apellido is required"],
            trim: true,
        },

        userEmail: {
            type: String,
            required: [true, "email is required"],
            unique: true
        },

        userPassword: {
            type: String,
            required: [true, "password is required"],
        },

        userPhone: {
            type: String,
            required: [true, "phone is required"],
        },

        photo:{
            type: String,
            default: null
        },

        userType:{
            type: String,
            enum: ["ADMIN", "CLIENTE"],
            default: "CLIENTE"
        },

        userActive:{
            type: Boolean,
            default: true
        }

    }
);

userSchema.index({userActive: 1});
userSchema.index({userType: 1});
userSchema.index({userActive: 1, userType: 1});

export default mongoose.model("User", userSchema);