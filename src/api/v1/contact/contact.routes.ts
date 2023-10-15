import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as contactController from "./contact.controller";
import { contactUsSchema } from "./contact.schemas";
const router = Router();

router.post("/contact-us", validate(contactUsSchema), contactController.contactUs);

export default router;
