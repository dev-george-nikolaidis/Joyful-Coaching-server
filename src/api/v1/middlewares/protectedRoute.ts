import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();
interface JwtPayload {
	id: string;
}

export const protectedRoute = async (req: Request<any>, res: Response, next: NextFunction) => {
	let token;
	try {
		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];
			// Verify token
			const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
			req.body.id = payload.id;
			next();
		}
	} catch (error) {
		return res.status(401).json({ Unauthorized: `Unauthorized Bearer ${error}` });
	}

	if (!token) {
		res.status(401);
		return res.status(401).json("Unauthorized no token");
	}
};
