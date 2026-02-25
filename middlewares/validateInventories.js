"use strict";

import { body, param, validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";

const handleValidation = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
            // Si la petición incluye 'cantidad' y es 0 o menor, forzamos el estado a inactivo (available = false)
            try {
                const rawCantidad = req.body?.cantidad;
                if (rawCantidad !== undefined && rawCantidad !== null && rawCantidad !== "") {
                    const cantidadNum = Number(rawCantidad);
                    if (!Number.isNaN(cantidadNum) && cantidadNum <= 0) {
                        req.body.available = false;
                    }
                }
            } catch (err) {
                // no bloquear si hay errores al parsear; seguir con la validación normal
                console.error("Error procesando cantidad en validator de inventario:", err);
            }

            return next();
    }

    if (req.file) {
        try {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
            console.log(`Imagen eliminada de Cloudinary debido a error de validación: ${publicId}`);
        } catch (err) {
            console.error("Error al eliminar imagen de Cloudinary:", err);
        }
    }

    return res.status(400).json({
        success: false,
        message: "Error de validación en los datos de la solicitud",
        errors: errors.array().map((error) => ({ field: error.path, message: error.msg }))
    });
};

const allowedUpdateFields = [
    "materialName",
    "materialPrice",
    "materialCategory",
    "productPhoto",
    "cantidad",
    "available"
];

const validateAllowedUpdateFields = (req, res, next) => {
    const payloadKeys = Object.keys(req.body ?? {});

    if (payloadKeys.length === 0) {
        return res.status(400).json({ success: false, message: "Debes enviar al menos un campo para actualizar" });
    }

    const invalidFields = payloadKeys.filter((field) => !allowedUpdateFields.includes(field));

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Campos inválidos para actualizar inventario: ${invalidFields.join(", ")}`
        });
    }

    return next();
};

export const validateInventoryId = [
    param("id").notEmpty().withMessage("El id del inventario es obligatorio").bail().isMongoId().withMessage("El id del inventario no es válido"),
    handleValidation
];

export const validateCreateInventory = [
    body("materialName").notEmpty().withMessage("materialName es obligatorio").bail().isString().withMessage("materialName debe ser una cadena de texto").trim(),

    body("materialPrice").notEmpty().withMessage("materialPrice es obligatorio").bail().isFloat({ min: 0.01 }).withMessage("materialPrice debe ser un número mayor a 0"),

    body("materialCategory")
        .notEmpty()
        .withMessage("materialCategory es obligatorio")
        .bail()
        .isIn(["VERDURAS", "FRUTAS", "CARNES", "LIMPIEZA", "REFRIGERADOS", "OTROS"])
        .withMessage("materialCategory debe ser VERDURAS, FRUTAS, CARNES, LIMPIEZA, REFRIGERADOS o OTROS"),

    body("productPhoto").optional({ nullable: true }).isString().withMessage("productPhoto debe ser una cadena de texto").trim(),

    body("cantidad").optional().isFloat({ min: 0 }).withMessage("cantidad debe ser un número mayor o igual a 0"),

    body("available").optional().isBoolean().withMessage("available debe ser true o false"),

    handleValidation
];

export const validateUpdateInventory = [
    validateAllowedUpdateFields,

    body("materialName").optional().isString().withMessage("materialName debe ser una cadena de texto").trim(),

    body("materialPrice").optional().isFloat({ min: 0.01 }).withMessage("materialPrice debe ser un número mayor a 0"),

    body("materialCategory")
        .optional()
        .isIn(["VERDURAS", "FRUTAS", "CARNES", "LIMPIEZA", "REFRIGERADOS", "OTROS"])
        .withMessage("materialCategory debe ser VERDURAS, FRUTAS, CARNES, LIMPIEZA, REFRIGERADOS o OTROS"),

    body("productPhoto").optional({ nullable: true }).isString().withMessage("productPhoto debe ser una cadena de texto").trim(),

    body("cantidad").optional().isFloat({ min: 0 }).withMessage("cantidad debe ser un número mayor o igual a 0"),

    body("available").optional().isBoolean().withMessage("available debe ser true o false"),

    handleValidation
];

export default {
    validateCreateInventory,
    validateUpdateInventory,
    validateInventoryId
};