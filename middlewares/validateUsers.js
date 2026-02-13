'use strict';

import { body, validationResult } from 'express-validator';

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: 'Error de validación en los datos de la solicitud',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }))
    });
};

export const validateCreateUser = [
    body('userNombre')
        .notEmpty().withMessage('userNombre es obligatorio')
        .bail()
        .isString().withMessage('userNombre debe ser una cadena de texto')
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('userNombre debe contener entre 1 y 50 caracteres'),

    body('userApellido')
        .notEmpty().withMessage('userApellido es obligatorio')
        .bail()
        .isString().withMessage('userApellido debe ser una cadena de texto')
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('userApellido debe contener entre 1 y 50 caracteres'),

    body('userEmail')
        .notEmpty().withMessage('userEmail es obligatorio')
        .bail()
        .isEmail().withMessage('userEmail no es válido')
        .normalizeEmail(),

    body('userPassword')
        .notEmpty().withMessage('userPassword es obligatorio')
        .bail()
        .isString().withMessage('userPassword debe ser una cadena de texto')
        .isLength({ min: 6 }).withMessage('userPassword debe contener al menos 6 caracteres'),

    body('userPhone')
        .notEmpty().withMessage('userPhone es obligatorio')
        .bail()
        .isString().withMessage('userPhone debe ser una cadena de texto')
        .trim()
        .isLength({ min: 8, max: 20 }).withMessage('userPhone debe contener entre 8 y 20 caracteres'),

    body('photo')
        .optional({ nullable: true })
        .isString().withMessage('photo debe ser una cadena de texto')
        .trim(),

    body('userType')
        .optional()
        .isIn(['ADMIN', 'CLIENTE']).withMessage('userType debe ser ADMIN o CLIENTE'),

    body('userActive')
        .optional()
        .isBoolean().withMessage('userActive debe ser true o false'),

    handleValidation
];
