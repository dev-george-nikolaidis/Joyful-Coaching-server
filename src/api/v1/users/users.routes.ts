import { Router } from "express";
import { protectedRoute } from "../middlewares/protected-route";
import { validate } from "../middlewares/validate";

import * as usersController from "./users.controller";
import { passwordResetSchema, userLoginSchema, userRegisterSchema } from "./users.schemas";

const router = Router();

// public
router.post("/login", validate(userLoginSchema), usersController.loginUser);
router.post("/register", validate(userRegisterSchema), usersController.registerUser);
router.post("/password-reset", validate(passwordResetSchema), usersController.passwordReset);

//private
router.post("/account", protectedRoute, usersController.getUserInfo);
router.put("/password-update", protectedRoute, usersController.updatePassword);
router.put("/password-rest-login", protectedRoute, usersController.passwordRestLogin);

export default router;
