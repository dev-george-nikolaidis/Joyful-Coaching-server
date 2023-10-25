import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { Stripe } from "stripe";
import { pool } from "../config/dbPool";
import { SessionPacketT } from "./appointmentsTypes";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string, {
	apiVersion: "2023-08-16",
});

// @desc    buy  packet
// @route   POST /api/v1/appointments/buy
// @access  Private

export async function buySessionPacket(req: Request<{}, never, SessionPacketT>, res: Response, next: NextFunction) {
	// const items = req.body.items;
	const { amount, cost, level, price, service } = req.body.sessionPacket;

	const YOUR_DOMAIN = process.env.Client_DOMAIN || "http://localhost:5173";
	try {
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: "EUR",
						product_data: {
							name: `Packlet: ${level}`,
							description: service,
							images: ["https://res.cloudinary.com/dsrzlxnkc/image/upload/v1697880142/Joyful%20Coaching/session-packet_ag84qf.webp"],
						},
						unit_amount: cost * 100,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			// success_url: `${YOUR_DOMAIN}/checkout-success`,
			success_url: `${YOUR_DOMAIN}?success=true`,
			cancel_url: `${YOUR_DOMAIN}`,
		});

		res.send({ url: session.url, session_id: session.id });
	} catch (error) {
		next(error);
	}
}

// @desc    check if payment is complied
// @route   POST /api/v1/appointments/confirm
// @access  Private

export async function confirmOrder(req: Request<{}, never, { session_id: string; id: number }>, res: Response, next: NextFunction) {
	const { session_id, id } = req.body;
	try {
		// console.log(id);
		const session = await stripe.checkout.sessions.retrieve(session_id);
		// console.log(session);
		if (session.payment_status === "paid") {
			const amount = 2;
			// find
			const query = "SELECT * FROM users WHERE id = $1";
			const user = await pool.query(query, [id]);
			const currentAppointments = user.rows[0].appointments;

			// update
			const updateQuery = `UPDATE  users SET appointments = $1 Where id = $2`;
			await pool.query(updateQuery, [currentAppointments + amount, id]);
			res.status(200).send("Update was a success!");
		} else {
			res.status(404).send("Payment request failed , please try again.");
		}
	} catch (error) {
		next(error);
	}
}

// @desc    check specific day for open session
// @route   POST /api/v1/appointments/check-availability
// @access  Private
export async function checkAvailability(req: Request<{}, never, { data: Date }>, res: Response, next: NextFunction) {
	const { data } = req.body;
	console.log(data);

	// check if there is date
	const fetchDateQuery = "SELECT * FROM  appointments where date = $1";
	const date = await pool.query(fetchDateQuery, [data]);
	console.log(date.rows.length);

	if (date.rows.length === 0) {
		res.status(200).send("free");
	} else {
		res.status(200).json(
			date.rows.map((r) => {
				return r.appointment;
			})
		);
	}

	try {
	} catch (error) {
		next(error);
	}
}

// @desc    book a session
// @route   POST /api/v1/appointments/book
// @access  Private

export async function book(req: Request<{}, never, { id: number; appointmentId: number; appointmentDate: Date }>, res: Response, next: NextFunction) {
	const { id, appointmentId, appointmentDate } = req.body;
	// console.log(appointmentId, appointmentDate);

	try {
		// fetchUser
		const query = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(query, [id]);

		// check if the user have enough sessions
		if (user.rows[0].appointments === 0) {
			console.log(`  book appointments ${user.rows[0].appointments}`);
			return res.status(402).json("Not enough sessions.");
		}

		// book the session.
		const bookQuery = `INSERT INTO appointments (date,appointment,user_id) VALUES($1,$2,$3) RETURNING *`;
		if (await pool.query(bookQuery, [appointmentDate, appointmentId, id])) {
			//update user  session count
			const currentAppointments = user.rows[0].appointments;
			const updateQuery = `UPDATE  users SET appointments = $1 Where id = $2`;
			await pool.query(updateQuery, [currentAppointments - 1, id]);
			return res.status(200).send("Success");
		}

		//send success message
	} catch (error) {
		next(error);
	}
}
// @desc    Delete/Cancel an appointment
// @route   DELETE /api/v1/appointments/cancel
// @access  Private

export async function cancelAppointment(req: Request<{}, never, { id: number; appointmentId: number; appointmentDate: Date }>, res: Response, next: NextFunction) {
	const { id, appointmentId, appointmentDate } = req.body;

	try {
		// delete the appointment from appointments table
		const deleteQuery = "DELETE FROM  appointments WHERE date = $1 and appointment = $2 and user_id = $3 ";
		await pool.query(deleteQuery, [appointmentDate, appointmentId, id]);

		// update user appointments
		const userQuery = "SELECT * FROM users WHERE id = $1";
		const user = await pool.query(userQuery, [id]);
		const currentAppointments = user.rows[0].appointments;
		const updateQuery = "UPDATE  users SET appointments = $1 Where id = $2";
		await pool.query(updateQuery, [currentAppointments + 1, id]);
		//send success message

		return res.status(200).send("Delete was a success.");
	} catch (error) {
		next(error);
	}
}
