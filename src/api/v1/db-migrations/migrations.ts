import { pool } from "../config/db";
import { appointments, usersModel } from "../database/db.models";

const migrate = async () => {
	await pool.query(usersModel);
	await pool.query(appointments);
};

try {
	migrate();
	console.log("Migrations has been created successfully!");
} catch (error) {
	// console.log(error);
}
