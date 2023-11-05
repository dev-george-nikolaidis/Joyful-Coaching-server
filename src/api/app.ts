import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import api from "./v1/indexRoutes";
import { errorHandler } from "./v1/middlewares/errorHandler";
import { notFound } from "./v1/middlewares/notFound";
import Strategies from "./v1/middlewares/passport";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(helmet());

const corsOptions = {
	origin: "*",
	methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(
	session({
		secret: process.env.COOKIE_SECRET!,
		resave: true,
		saveUninitialized: true,
		cookie: {
			sameSite: "none",
			secure: true,
			maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
Strategies();
app.use("/api/v1", api);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running`);
});
