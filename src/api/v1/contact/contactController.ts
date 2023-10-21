// @desc    Contact us
// @route   POST /api/v1/contact/contact-us
// @access  public

import axios from "axios";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { pool } from "../config/dbPool";

dotenv.config();

export interface message {
	name: string;
	subject: string;
	email: string;
	textarea: string;
	token: string;
}

// @desc    Gest can register at newsletter
// @route   POST /api/v1/contact/newsletter
// @access  public
export async function newsletter(req: Request<{}, never, { email: string }>, res: Response, next: NextFunction) {
	const { email } = req.body;
	console.log(email);
	try {
		// check if we have email
		const qFindEmail = "SELECT * FROM newsletter WHERE email = $1";
		const payloadEmail = await pool.query(qFindEmail, [email]);

		if (payloadEmail.rows[0]) {
			return res.json({ email: "Email is already registered." });
		}

		const qNewsletter = "INSERT INTO  newsletter (email) VALUES ($1)RETURNING *";
		await pool.query(qNewsletter, [email]);
		return res.json({ success: "You successfully registered in our newsletter" });
	} catch (error) {
		next(error);
	}
}

// @desc    Gest can contact us
// @route   POST /api/v1/contact/contact-us
// @access  public

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
