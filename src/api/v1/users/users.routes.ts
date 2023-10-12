import { Router } from "express";
import { protectedRoute } from "../middlewares/protected-route";
import { validate } from "../middlewares/validate";

import * as usersController from "./users.controller";
import { userLoginSchema, userRegisterSchema } from "./users.schemas";

const router = Router();

router.post("/login", validate(userLoginSchema), usersController.loginUser);

router.post("/account", protectedRoute, usersController.getUserInfo);
router.post("/password-update", protectedRoute, usersController.updatePassword);

router.post("/register", validate(userRegisterSchema), usersController.registerUser);

export default router;
