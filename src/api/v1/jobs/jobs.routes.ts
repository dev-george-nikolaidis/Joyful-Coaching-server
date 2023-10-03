import { Router } from "express";
import { validate } from "../middlewares/validate";
import { jobSchema, updateJobSchema } from "./jobs.schemas";
import * as jobsController from "../jobs/jobs.controller";
import { protectedRoute } from "../middlewares/protected-route";

const router = Router();

router.post("/create", protectedRoute, validate(jobSchema), jobsController.createJob);
router.post("/all/:id", protectedRoute, jobsController.getAllJobsByUser);
router.post("/one/:user_id/job_id", protectedRoute, jobsController.getSingleJob);
router.post("/update", protectedRoute, validate(updateJobSchema), jobsController.updateJob);
router.post("/delete/:job_id", protectedRoute, jobsController.deleteJob);

export default router;
