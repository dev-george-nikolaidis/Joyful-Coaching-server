import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();
export interface JwtPayload {
	id: string;
	iat: number;
	exp: number;
}

export const protectedRoute = async (req: Request<any>, res: Response, next: NextFunction) => {
	let token;

	try {
		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			//check if token is expired
			const decodedToken = jwt.decode(token) as JwtPayload;
			const date = new Date();

			if (decodedToken.exp * 1000 < date.getTime()) {
				return res.status(200).json({ tokenExpiredError: "Token is expired" });
			}

			// console.log(`token ${token}`);
			// Verify token
			const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
			req.body.id = payload.id;
			next();
		}
	} catch (error) {
		return res.status(401).json({ Unauthorized: `Unauthorized Bearer token ${error}` });
	}

	if (!token) {
		res.status(401);
		return res.status(401).json("Unauthorized no token");
	}
};
