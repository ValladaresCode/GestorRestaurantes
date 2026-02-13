"use strict";

import { Router } from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from "./restaurant.controller.js";

const router = Router();

/**
 * @route   POST /gestorRestaurantes/api/v1/restaurants/create
 * @desc    Crear restaurante
 */
router.post("/create", createRestaurant);

/**
 * @route   GET /gestorRestaurantes/api/v1/restaurants
 * @desc    Obtener todos los restaurantes
 */
router.get("/", getRestaurants);

/**
 * @route   GET /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Obtener restaurante por ID
 */
router.get("/:id", getRestaurantById);

/**
 * @route   PUT /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Actualizar restaurante
 */
router.put("/:id", updateRestaurant);

/**
 * @route   DELETE /gestorRestaurantes/api/v1/restaurants/:id
 * @desc    Eliminar restaurante (soft delete recomendado)
 */
router.delete("/:id", deleteRestaurant);

export default router;
