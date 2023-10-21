import express from "express";
const router = express.Router();

import appointmentsRoutes from "./appointments/appointmentsRoutes";
import contactRoutes from "./contact/contactRoutes";
import usersRoutes from "./users/usersRoutes";

router.use("/users", usersRoutes);

router.use("/appointments", appointmentsRoutes);
router.use("/contact", contactRoutes);

export default router;
