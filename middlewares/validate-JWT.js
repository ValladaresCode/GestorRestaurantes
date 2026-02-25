'use strict';

import jwt from 'jsonwebtoken';

// Verifica JWT y expone los datos básicos del sujeto y su rol
export const validateJWT = (req, res, next) => {
    try {
        let token = req.header('x-token') || req.header('authorization') || req.query.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No hay token en la petición' });
        }

        token = token.replace(/^Bearer\s+/, '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        });

        req.adminId = decoded.sub;
        req.userRole = decoded.role;
        req.user = { uid: decoded.sub, role: decoded.role };

        return next();
    } catch (error) {
        let message = 'Token inválido';
        if (error.name === 'TokenExpiredError') message = 'Token expirado';

        return res.status(401).json({ success: false, message, error: error.message });
    }
};

// Permite continuar solo a usuarios con rol ADMIN_ROLE
export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'ADMIN_ROLE') {
        return res.status(403).json({ success: false, message: 'No tienes permisos para esta acción' });
    }
    return next();
};
