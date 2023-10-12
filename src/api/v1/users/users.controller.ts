import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { loginUserPayload, registerUserPayload } from "./users.interfaces";

// @desc    login user
// @route   GET /api/v1/users/login
// @access  public
export async function loginUser(req: Request<{}, never, loginUserPayload>, res: Response, next: NextFunction) {
	const { email, password } = req.body;

	try {
		// Check for user email
		const query = "SELECT * FROM users WHERE email = $1";
		const user = await pool.query(query, [email]);
		if (user && (await bcrypt.compare(password, user.rows[0].password))) {
			// we need those critical details about the user in the client ?
			const self = {
				id: user.rows[0].id,
				// username: user.rows[0].username,
				email: user.rows[0].email,
			};

			res.status(200).json({
				token: _generateToken(user.rows[0].id),
			});
		} else {
			res.status(401).send("Invalid credentials");
		}
	} catch (error) {
		next(error);
	}
}

// @desc    create  user
// @route   POST /api/v1/users/register
// @access  Private
export async function registerUser(req: Request<{}, never, registerUserPayload>, res: Response, next: NextFunction) {
	const { email, password } = req.body;

	try {
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const query = `INSERT INTO users(email,password) VALUES($1,$2) RETURNING *`;
		const values = [email, hashedPassword];
		const self = await pool.query(query, values);
		res.status(200).json(self.rows[0]);
	} catch (error) {
		next(error);
	}
}

// @desc    update password
// @route   POST /api/v1/users/password-update
// @access  private

export async function updatePassword(req: Request<{}, never, { password: string; id: number }>, res: Response, next: NextFunction) {
	const { id, password } = req.body;

	try {
		// find the user
		const query = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(query, [id]);

		//make new jwt
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//update in database
		const updateQuery = `UPDATE  users SET password = $1 Where id = $2`;
		await pool.query(updateQuery, [hashedPassword, id]);

		const newToken = await pool.query(query, [id]);
		const updatedUser = await pool.query(query, [id]);
		//send back the new one
		res.status(200).json(_generateToken(updatedUser.rows[0].id));
	} catch (error) {
		next(error);
	}
}

// @desc    get user infos
// @route   POST /api/v1/users/account-info
// @access  private

export async function getUserInfo(req: Request<{}, never, { token: string; id: number }>, res: Response, next: NextFunction) {
	const { id } = req.body;

	try {
		const query = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(query, [id]);
		res.status(200).json(user.rows[0]);
	} catch (error) {
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
