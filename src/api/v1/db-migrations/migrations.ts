import { pool } from "../config/dbPool";
import { appointments, contract, newsletter, usersModel } from "../database/dbModels";

const migrate = async () => {
	await pool.query(usersModel);
	await pool.query(appointments);
	await pool.query(contract);
	await pool.query(newsletter);
};

try {
	migrate();
	console.log("Migrations has been created successfully!");
} catch (error) {
	console.log(error);
}
