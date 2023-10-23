import express from "express";
import { createLazyRouter } from "express-lazy-router";

const lazyLoad = createLazyRouter({
	preload: process.env.NODE_ENV === "production",
});
const router = express.Router();
router.get("/welcome", (req, res) => {
	res.send("Welcome");
});

router.use(
	"/users",
	lazyLoad(() => import("./users/usersRoutes"))
);

router.use(
	"/appointments",
	lazyLoad(() => import("./appointments/appointmentsRoutes"))
);
router.use(
	"/contact",
	lazyLoad(() => import("./contact/contactRoutes"))
);

export default router;
