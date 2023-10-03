import { Router, Request, Response } from "express";
import { protectedRoute } from "../middlewares/protected-route";
import { validate } from "../middlewares/validate";

import * as productController from "./products.controller";

const router = Router();

// Auth protected route example;
router.get("/", protectedRoute, (req: Request, res: Response) => {
	res.send("Get products");
});

// router.get("/", (req: Request, res: Response) => {
// 	res.send("Get products");
// });

router.get("/:categoryId", productController.getProductsByCategory);

export default router;
