import dotenv from "dotenv";
import pgPool from "pg";

dotenv.config();
export const pool = new pgPool.Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST as string,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: Number(process.env.PG_PORT),
	ssl: process.env.NODE_ENV === "development" ? false : true,
});
