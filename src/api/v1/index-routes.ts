import express from "express";
const router = express.Router();

import appointmentsRoutes from "../v1/appointments/appointments.routes";
import jobsRoutes from "../v1/jobs/jobs.routes";
import usersRoutes from "../v1/users/users.routes";

router.use("/users", usersRoutes);
router.use("/jobs", jobsRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
