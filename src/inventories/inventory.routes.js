"use strict";

import { Router } from "express";
import inventoryController from "./inventory.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import validateInventories from "../../middlewares/validateInventories.js";

const router = Router();

router.post(
	"/",
	uploadFieldImage.single("productPhoto"),
	validateInventories.validateCreateInventory,
	inventoryController.createInventory
);

router.get("/", inventoryController.getInventories);

router.get("/:id", validateInventories.validateInventoryId, inventoryController.getInventoryById);

router.put(
	"/:id",
	uploadFieldImage.single("productPhoto"),
	validateInventories.validateUpdateInventory,
	inventoryController.updateInventory
);

router.delete("/:id", validateInventories.validateInventoryId, inventoryController.deleteInventory);

export default router;
