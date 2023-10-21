import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as contactController from "./contactController";
import { contactUsSchema } from "./contactSchemas";
const router = Router();

router.post("/contact-us", validate(contactUsSchema), contactController.contactUs);
router.post("/newsletter", contactController.newsletter);

export default router;
