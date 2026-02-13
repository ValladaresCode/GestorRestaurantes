import { Router } from "express";

import {createUser, getUsers} from "./user.controller.js";

import { validateCreateUser} from "../../middlewares/validateUser.js";

const router = Router();


router.post(
    "/create",
    validateCreateUser,
    createUser
);


router.get(
    "/",
    getUsers
);

export default router;
