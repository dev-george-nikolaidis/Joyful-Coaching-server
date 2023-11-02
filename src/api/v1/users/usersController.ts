import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

import nodemailer from "nodemailer";
import { pool } from "../config/dbPool";
import { convertAppointmentNumberToDate, generateToken } from "../util/helpers";
import { loginUserPayload, registerUserPayload } from "./usersInterfaces";

dotenv.config();

// @desc    login user with google
// @route   GET /api/v1/users/google/login
// @access  public
export async function googleLoginUser(req: Request<{}, never, loginUserPayload>, res: Response, next: NextFunction) {
	// TODO
	// const { email, password } = req.body;
	// try {
	// 	// Check for user email
	// 	const query = "SELECT * FROM users WHERE email = $1";
	// 	const user = await pool.query(query, [email]);
	// 	if (user.rows[0] && (await bcrypt.compare(password, user.rows[0].password))) {
	// 		// we need those critical details about the user in the client ?
	// 		const self = {
	// 			id: user.rows[0].id,
	// 			// username: user.rows[0].username,
	// 			email: user.rows[0].email,
	// 		};
	// 		return res.status(200).json({
	// 			token: generateToken(user.rows[0].id),
	// 		});
	// 	} else {
	// 		return res.status(200).json({ Invalid: "Invalid credentials" });
	// 	}
	// } catch (error) {
	// 	next(error);
	// }
}

// @desc    login user
// @route   GET /api/v1/users/login
// @access  public
export async function loginUser(req: Request<{}, never, loginUserPayload>, res: Response, next: NextFunction) {
	const { email, password } = req.body;
	try {
		// Check for user email
		const query = "SELECT * FROM users WHERE email = $1";
		const user = await pool.query(query, [email]);

		if (user.rows[0] && (await bcrypt.compare(password, user.rows[0].password))) {
			const user_id = user.rows[0].id;
			const token = generateToken(user_id);
			// const refreshToken = generateRefreshToken(user_id);

			// return res
			// 	.cookie("refreshToken", refreshToken, {
			// 		httpOnly: true,
			// 		sameSite: "none",
			// 	})
			// 	.json({
			// 		token: token,
			// 	});

			return res.status(200).json({
				token: token,
			});
		} else {
			return res.status(200).json({ Invalid: "Invalid credentials" });
		}
	} catch (error) {
		next(error);
	}
}

// @desc  	Password reset
// @route   Put /api/v1/users/password-rest-login
// @access  Private
export async function passwordRestLogin(req: Request<{}, never, { id: number; password: string; token: string }>, res: Response, next: NextFunction) {
	const { id, password, token } = req.body;

	try {
		// Check for user email
		const query = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(query, [id]);
		console.log(user);
		if (user.rows[0].password_reset_token === token) {
			// we need those critical details about the user in the client ?

			// need to update
			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const updateQuery = `UPDATE  users SET password = $1 Where id = $2`;
			await pool.query(updateQuery, [hashedPassword, id]);

			return res.status(200).json({
				token: generateToken(user.rows[0].id),
			});
		} else {
			return res.status(200).json({ Invalid: "Invalid credentials" });
		}
	} catch (error) {
		next(error);
	}
}

// @desc    create  user
// @route   POST /api/v1/users/register
// @access  Private
export async function registerUser(req: Request<{}, never, registerUserPayload>, res: Response, next: NextFunction) {
	const { email, password, token } = req.body;

	try {
		const validateToken = await await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${token}`);
		if (validateToken.data.success) {
			// Check for user email
			const userQuery = "SELECT * FROM users WHERE email = $1";
			const user = await pool.query(userQuery, [email]);
			// console.log(user.rows[0]);
			if (user.rows[0]) {
				return res.status(200).json({ userExist: "User already exist" });
			}
			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const query = `INSERT INTO users(email,password) VALUES($1,$2) RETURNING *`;
			const values = [email, hashedPassword];
			const self = await pool.query(query, values);
			return res.status(200).json({ user: self.rows[0] });
		} else {
			return res.status(200).json({ failToken: "fail" });
		}
	} catch (error) {
		next(error);
	}
}

// @desc    update password
// @route   PUT /api/v1/users/password-update
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
		return res.status(200).json(generateToken(updatedUser.rows[0].id));
	} catch (error) {
		next(error);
	}
}

// @desc    Logout user
// @route   POST /api/v1/users/logout
// @access  private

export async function logout(req: Request<{}, never, { id: number }>, res: Response, next: NextFunction) {
	const { id } = req.body;

	try {
		//update in database
		// const updateQuery = `UPDATE  users SET refresh_token = $1 Where id = $2`;
		// await pool.query(updateQuery, ["", id]);

		//send back the new one
		return res.status(200).json("You have been successfully logged out.");
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
		const userQuery = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(userQuery, [id]);
		const getSessions = "SELECT * FROM appointments WHERE user_id = $1 ORDER BY date;";
		const appointments = await pool.query(getSessions, [id]);

		const pastAppointments = [];
		const today = new Date();

		const currentOpenAppointments = appointments.rows.filter((a) => {
			let appointmentDate = convertAppointmentNumberToDate(a.appointment, a.date);
			console.log(appointmentDate);

			if (today.getTime() < appointmentDate.getTime()) {
				return a;
			} else {
				pastAppointments.push(a);
			}
		});

		const payload = {
			userTable: user.rows[0],
			appointmentsTable: currentOpenAppointments,
		};
		return res.status(200).json(payload);
	} catch (error) {
		next(error);
	}
}

// @desc    Password reset request ,sending email with link for reset.
// @route   POST /api/v1/users/password-reset
// @access  public
export async function passwordReset(req: Request<{}, never, { email: string }>, res: Response, next: NextFunction) {
	const { email } = req.body;
	console.log(email);

	// check if we have user with this email.
	const userQuery = "SELECT * FROM users WHERE email = $1";
	const user = await pool.query(userQuery, [email]);

	if (user.rows[0] === undefined) {
		return res.status(200).json({ noUser: "No user" });
	}
	const user_id = user.rows[0].id;

	//create new token
	const token = generateToken(user_id, 900000);
	// console.log(`token  ${token}`);

	// update
	const updateQuery = `UPDATE  users SET password_reset_token = $1 Where id = $2`;
	await pool.query(updateQuery, [token, user_id]);

	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: "Reset account password link",
		html: `
		<h3>Please click the link below to reset your password</h3>
		<p>${process.env.Client_DOMAIN}/user/enter-new-password?token=${token}</p>`,
		// text: "Email content",
	};

	try {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				return res.status(400).json({ error: "reset password link error", mailerError: error });
			} else {
				return res.status(200).json({ success: "Email has been sent,please follow the instructions" });
			}
		});
	} catch (error) {
		next(error);
	}
}
