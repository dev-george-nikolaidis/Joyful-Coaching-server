import dotenv from "dotenv";
import { Router } from "express";
import passport from "passport";
import { protectedRoute } from "../middlewares/protectedRoute";
import { validate } from "../middlewares/validate";
import * as usersController from "./usersController";
import { passwordResetSchema, userLoginSchema, userRegisterSchema } from "./usersSchemas";
dotenv.config();
const router = Router();

// external api calls
// those end points called from the client
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/auth/linkedin", passport.authenticate("linkedin", { state: "SOME STATE" }));

// todo we need to find out how to take user emails address, current facebook api does not give
// router.get("/auth/facebook", passport.authenticate("facebook"));

//callbacks
router.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		// successRedirect: process.env.CLIENT_DOMAIN,
		// failureRedirect: `${process.env.CLIENT_DOMAIN}/user/login `,
	}),
	usersController.facebookRegister
);
router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		// successRedirect: process.env.CLIENT_DOMAIN,
		// failureRedirect: `${process.env.CLIENT_DOMAIN}/user/login `,
	}),
	usersController.googleRegister
);
router.get(
	"/auth/linkedin/callback",
	passport.authenticate("linkedin", {
		// successRedirect: process.env.CLIENT_DOMAIN,
		// failureRedirect: `${process.env.CLIENT_DOMAIN}/user/login `,
	}),
	usersController.linkedinRegister
);

// public
router.post("/login", validate(userLoginSchema), usersController.loginUser);
router.post("/register", validate(userRegisterSchema), usersController.registerUser);
router.post("/password-reset", validate(passwordResetSchema), usersController.passwordReset);

//private
// router.post("/logout", protectedRoute, usersController.logout);
router.post("/account", protectedRoute, usersController.getUserInfo);
router.put("/password-update", protectedRoute, usersController.updatePassword);
router.put("/password-rest-login", protectedRoute, usersController.passwordRestLogin);

export default router;
