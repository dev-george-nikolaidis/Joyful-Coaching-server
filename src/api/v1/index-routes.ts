import express from "express";
const router = express.Router();

import appointmentsRoutes from "../v1/appointments/appointments.routes";
import contactRoutes from "../v1/contact/contact.routes";
import usersRoutes from "../v1/users/users.routes";

router.use("/users", usersRoutes);

router.use("/appointments", appointmentsRoutes);
router.use("/contact", contactRoutes);

export default router;
