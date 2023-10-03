import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import api from "./v1/index-routes";
import { errorHandler } from "./v1/middlewares/error-handler";
import { notFound } from "./v1/middlewares/not-found";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());
app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());

app.use("/api/v1", api);

app.get("/", (req, res) => {
	res.send("Hi");
});
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Listening: http://localhost:${port}`);
});
