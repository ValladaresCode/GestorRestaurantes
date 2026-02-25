"use strict";

import { Router } from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from "./restaurant.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { validateJWT, isAdmin } from "../../middlewares/validate-JWT.js";
import { validateCreateRestaurant, validateUpdateRestaurant } from "../../middlewares/validateRestaurants.js";

const router = Router();

/**
 * @route   POST /gestorRestaurantes/api/v1/restaurants/create
 * @desc    Crear restaurante
 */
router.post("/create", validateJWT, isAdmin, uploadFieldImage.single('restaurantPhoto'), validateCreateRestaurant, createRestaurant);

/**
 * @route   GET /gestorRestaurantes/api/v1/restaurants
 * @desc    Obtener todos los restaurantes
 */
router.get("/", validateJWT, isAdmin, getRestaurants);

/**
 * @route   GET /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Obtener restaurante por ID
 */
router.get("/:id", validateJWT, isAdmin, getRestaurantById);

/**
 * @route   PUT /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Actualizar restaurante
 */
router.put("/:id", validateJWT, isAdmin, validateUpdateRestaurant, updateRestaurant);

/**
 * @route   DELETE /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Eliminar restaurante (soft delete recomendado)
 */
router.delete("/:id", validateJWT, isAdmin, deleteRestaurant);

export default router;
