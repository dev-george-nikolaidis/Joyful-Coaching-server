import { Router, Request, Response } from "express";
import { validate } from "../middlewares/validate";

import * as usersController from "./users.controller";
import { userLoginSchema, userRegisterSchema } from "./users.schemas";

const router = Router();

router.post("/login", validate(userLoginSchema), usersController.loginUser);

router.post("/register", validate(userRegisterSchema), usersController.registerUser);

export default router;
