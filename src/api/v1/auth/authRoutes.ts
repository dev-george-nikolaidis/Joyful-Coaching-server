import { Router } from "express";

import * as authController from "./authController";

const router = Router();
// router.post("/refresh-token", authController.refreshToken);
// router.post("/refresh-cookie-token", authController.refreshCookieToken);
router.post("/token", authController.validateToken);

export default router;
