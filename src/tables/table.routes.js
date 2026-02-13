"use strict";

import { Router } from "express";
import {
	createTable,
	deleteTable,
	getTableById,
	getTables,
	updateTable,
} from "./table.controller.js";
import {
	validateCreateTable,
	validateGetTables,
	validateTableId,
	validateUpdateTable,
} from "../../middlewares/table.middleware.js";

const router = Router();

router.post("/", validateCreateTable, createTable);
router.get("/", validateGetTables, getTables);
router.get("/:id", validateTableId, getTableById);
router.put("/:id", validateTableId, validateUpdateTable, updateTable);
router.delete("/:id", validateTableId, deleteTable);

export default router;
