import { Router } from "express";
import { protectedRoute } from "../middlewares/protected-route";
import * as appointmentsController from "./appointments.controllers";
const router = Router();

router.post("/buy", protectedRoute, appointmentsController.buySessionPacket);
router.post("/check-availability", protectedRoute, appointmentsController.checkAvailability);
router.post("/confirm", protectedRoute, appointmentsController.confirmOrder);
router.post("/book", protectedRoute, appointmentsController.book);

export default router;
