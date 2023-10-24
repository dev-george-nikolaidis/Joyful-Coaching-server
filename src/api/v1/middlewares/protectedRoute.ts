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
			// console.log(`req.headers.authorization ${req.headers.authorization}`);
			token = req.headers.authorization.split(" ")[1];
			// console.log(`token ${token}`);
			const jwtSecret = process.env.JWT_SECRET!;
			// Verify token
			const { id } = jwt.verify(token, jwtSecret) as JwtPayload;

			// Get user from the token
			// const query = "SELECT * FROM users WHERE id = $1";
			// const user = await pool.query(query, [id]);
			req.body.id = id;
			next();
		}
	} catch (error) {
		return res.status(401).json({ Unauthorized: { message: "Unauthorized Bearer", token: token, jwtSecret: process.env.JWT_SECRET! } });
	}

	if (!token) {
		res.status(401);
		return res.status(401).json("Unauthorized no token");
	}
};
