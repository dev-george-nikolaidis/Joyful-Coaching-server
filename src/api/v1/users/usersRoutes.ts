import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { validate } from "../middlewares/validate";

import * as usersController from "./usersController";
import { passwordResetSchema, userLoginSchema, userRegisterSchema } from "./usersSchemas";

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
