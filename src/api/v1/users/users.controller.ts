import { NextFunction, Request, Response } from "express";
import { loginUserPayload, registerUserPayload } from "./users.interfaces";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db";

// @desc    get  user
// @route   GET /api/v1/users/login
// @access  public
export async function loginUser(req: Request<{}, never, loginUserPayload>, res: Response, next: NextFunction) {
	const { email, password } = req.body;

	try {
		// Check for user email
		const query = "SELECT * FROM users WHERE email = $1";
		const user = await pool.query(query, [email]);
		console.log(user.rows[0].password);
		if (user && (await bcrypt.compare(password, user.rows[0].password))) {
			res.json({
				id: user.rows[0].id,
				username: user.rows[0].username,
				email: user.rows[0].email,
				token: _generateToken(user.rows[0].id),
			});
		} else {
			res.status(400).send("Invalid credentials");
		}
	} catch (error) {
		next(error);
	}
}

// @desc    create  user
// @route   POST /api/v1/users/register
// @access  Public
export async function registerUser(req: Request<{}, never, registerUserPayload>, res: Response, next: NextFunction) {
	const { username, email, password } = req.body;

	try {
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const query = `INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *`;
		const values = [username, email, hashedPassword];
		const self = await pool.query(query, values);
		res.status(200).json(self.rows[0]);
	} catch (error) {
		console.log(error);
		next(error);
	}
}

// Generate JWT
const _generateToken = (id: any) => {
	const jwtSecret = process.env.JWT_SECRET as string;
	const jwtExpTime = process.env.JWT_TOKEN_EXPIRATION || 1;
	return jwt.sign({ id }, jwtSecret, {
		expiresIn: `${jwtExpTime}d`,
	});
};
