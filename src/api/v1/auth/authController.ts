import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/dbPool";
import { JwtPayload } from "../middlewares/protectedRoute";
import { generateRefreshToken, generateToken } from "../util/helpers";
dotenv.config();

// @desc    refresh user token
// @route   post /api/v1/auth/refresh-token
// @access  public
export async function refreshToken(req: Request<{}, never, { id: string; refreshToken: string }>, res: Response, next: NextFunction) {
	const { id, refreshToken } = req.body;
	// console.log(`id ${id}`);

	console.log(` refreshToken ${refreshToken}`);

	if (!refreshToken) {
		return res.status(401).json("No refresh token provided!");
	}

	try {
		// check for refresh token
		jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, async (err: any, user: any) => {
			if (err) {
				return res.status(401).json("Refresh token authorization error !");
			}

			// fetch refresh token
			const queryString = "SELECT * FROM users WHERE id = $1";
			const self = await pool.query(queryString, [id]);

			// check if the refresh tokens match
			console.log(self.rows[0].refresh_token == refreshToken);
			if (self.rows[0].refresh_token === refreshToken) {
				const newAccessToken = generateToken(id);
				const newRefreshToken = generateRefreshToken(id);
				// update refresh token in database
				const updateQuery = `UPDATE  users SET refresh_token = $1 Where id = $2`;
				await pool.query(updateQuery, [newRefreshToken, id]);

				return res.status(200).json({
					token: newAccessToken,
					refreshToken: newRefreshToken,
				});
			} else {
				return res.status(401).json("Unauthorize to take refresh token !");
			}
		});
	} catch (error) {
		next(error);
	}
}

// @desc    refresh user token
// @route   post /api/v1/auth/refresh-cookie-token
// @access  public
export async function refreshCookieToken(req: Request<{}, never, {}>, res: Response, next: NextFunction) {
	const refreshToken = req.cookies["refreshToken"];
	if (!refreshToken) {
		return res.status(401).send("Access Denied. No refresh token provided.");
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
		const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION! });
		res.header("Authorization", accessToken).send("refreshed");
	} catch (error) {
		return res.status(400).send("Invalid refresh token.");
	}
}

// @desc    validate token
// @route   post /api/v1/auth/token
// @access  private
export async function validateToken(req: Request<{}, never, {}>, res: Response, next: NextFunction) {
	return res.status(200).json({ legitToken: "User is authorized" });
}
