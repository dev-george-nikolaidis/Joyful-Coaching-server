import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import api from "./v1/indexRoutes";
import { errorHandler } from "./v1/middlewares/errorHandler";
import { notFound } from "./v1/middlewares/notFound";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());

const corsOpt = {
	origin: "*",
	methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOpt));

app.use(express.json(), cookieParser());

app.use("/api/v1", api);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Listening: http://localhost:${port}`);
});
