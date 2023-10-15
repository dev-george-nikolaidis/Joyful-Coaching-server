// @desc    Contact us
// @route   POST /api/v1/contact/contact-us
// @access  public

import axios from "axios";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";

dotenv.config();

export interface message {
	name: string;
	subject: string;
	email: string;
	textarea: string;
	token: string;
}

export async function contactUs(req: Request<{}, never, message>, res: Response, next: NextFunction) {
	const { name, subject, email, textarea, token } = req.body;

	try {
		const validateToken = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCAPTCHA_KEY}&response=${token}`);
		if (validateToken.data.success) {
			const contactQuery = "INSERT INTO  contact (name,subject,email,textarea) VALUES ($1,$2,$3,$4)RETURNING *";
			await pool.query(contactQuery, [name, subject, email, textarea]);
			return res.send("Success");
		} else {
			return res.send("fail");
		}
	} catch (error) {
		next(error);
	}
}
