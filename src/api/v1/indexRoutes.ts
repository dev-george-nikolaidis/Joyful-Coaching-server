import express from "express";
// import { createLazyRouter } from "express-lazy-router";
// import dotenv from "dotenv";
// dotenv.config();

// const lazyLoad = createLazyRouter({
// 	preload: process.env.NODE_ENV === "production",
// });
const router = express.Router();

// router.use(
// 	"/users",
// 	lazyLoad(() => import("./users/usersRoutes"))
// );

// router.use(
// 	"/appointments",
// 	lazyLoad(() => import("./appointments/appointmentsRoutes"))
// );
// router.use(
// 	"/contact",
// 	lazyLoad(() => import("./contact/contactRoutes"))
// );
import appointmentsRoutes from "./appointments/appointmentsRoutes";
import contactRoutes from "./contact/contactRoutes";
import usersRoutes from "./users/usersRoutes";

router.use("/users", usersRoutes);

router.use("/appointments", appointmentsRoutes);
router.use("/contact", contactRoutes);
export default router;
