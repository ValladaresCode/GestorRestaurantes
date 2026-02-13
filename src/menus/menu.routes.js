"use strict";

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Menu route working"
  });
});

export default router;
