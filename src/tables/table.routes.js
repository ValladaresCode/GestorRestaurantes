"use strict";

import { Router } from "express";
import {
	createTable,
	deleteTable,
	getTableById,
	getTables,
	updateTable,
} from "./table.controller.js";

const router = Router();

router.post("/", createTable);
router.get("/", getTables);
router.get("/:id", getTableById);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;