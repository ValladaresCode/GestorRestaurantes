"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { dbConnection } from "./db.js";
import { corsOptions } from "./cors-configuration.js";

import restaurantRoutes from "../src/restaurants/restaurant.routes.js";
import menuRoutes from "../src/menus/menu.routes.js";
import tableRoutes from "../src/tables/table.routes.js";

const app = express();

// 🔹 Middlewares
app.use(helmet());
app.use(cors(corsOptions)); 
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// 🔹 Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        ok: true,
        status: "up",
        service: "Gestor de Restaurantes"
    });
});

// 🔹 Rutas
app.use("/gestorRestaurantes/api/v1/restaurants", restaurantRoutes);
app.use("/gestorRestaurantes/api/v1/menus", menuRoutes);
app.use("/gestorRestaurantes/api/v1/tables", tableRoutes);

// 🔹 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

export default app;
