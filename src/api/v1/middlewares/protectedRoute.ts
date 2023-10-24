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
		// if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		if (req.headers.authorization) {
			// Get token from header
			console.log(`req.headers.authorization ${req.headers.authorization}`);
			token = req.headers.authorization.split(" ")[1];
			// Verify token
			const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

			console.log(`token ${token}`);
			console.log(`id ${payload.id}`);
			// Get user from the token
			// const query = "SELECT * FROM users WHERE id = $1";
			// const user = await pool.query(query, [id]);
			req.body.id = payload.id;
			next();
		}
	} catch (error) {
		return res.status(401).json({ Unauthorized: "Unauthorized Bearer", error: error });
	}

	if (!token) {
		res.status(401);
		return res.status(401).json("Unauthorized no token");
	}
};
