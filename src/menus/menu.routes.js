"use strict";

import { Router } from "express";
import {
  createMenu,
  deleteMenu,
  getMenuById,
  getMenus,
  updateMenu
} from "./menu.controller.js";
import {
  validateCreateMenu,
  validateMenuId,
  validateUpdateMenu
} from "../../middlewares/validateMenus.js";

const router = Router();

router.post("/", validateCreateMenu, createMenu);
router.get("/", getMenus);
router.get("/:id", validateMenuId, getMenuById);
router.put("/:id", validateMenuId, validateUpdateMenu, updateMenu);
router.delete("/:id", validateMenuId, deleteMenu);

export default router;
