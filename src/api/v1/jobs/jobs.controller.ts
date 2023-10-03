import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";
import { Job, updateJob } from "./jobs.interfaces";

// @desc    Create a job
// @route   POST /api/v1/jobs/create
// @access  protected
export async function createJob(req: Request<{}, never, Job>, res: Response, next: NextFunction) {
	const { job_context, job_status, user_id } = req.body;

	try {
		const query = "INSERT INTO jobs (job,job_status,user_id) VALUES($1,$2,$3)  RETURNING *";
		const job = await pool.query(query, [job_context, job_status, user_id]);
		res.status(200).json(job.rows[0]);
	} catch (error) {
		next(error);
	}
}

// @desc    Get All user jobs
// @route   POST /api/v1/jobs/all/:id
// @access  protected
export async function getAllJobsByUser(req: Request<{ id: number }, never, never>, res: Response, next: NextFunction) {
	const { id } = req.params;
	try {
		const query = "SELECT * FROM jobs WHERE user_id = $1";
		const job = await pool.query(query, [+id]);
		res.status(200).json(job.rows);
	} catch (error) {
		next(error);
	}
}

// @desc    Get a single user job
// @route   POST /api/v1/jobs/one/:user_id/:job_id
// @access  protected
export async function getSingleJob(req: Request<{ user_id: number; job_id: number }, never, never>, res: Response, next: NextFunction) {
	const { job_id, user_id } = req.params;
	try {
		const query = "SELECT * FROM jobs WHERE user_id = $1 AND id = $2";
		const job = await pool.query(query, [+user_id, job_id]);
		res.status(200).json(job.rows[0]);
	} catch (error) {
		next(error);
	}
}
// @desc    Get a single user job
//  @route   POST /api/v1/jobs/one/:user_id/:job_id
// @access  protected
export async function updateJob(req: Request<{}, never, updateJob>, res: Response, next: NextFunction) {
	const { job_id, user_id, job_context, job_status } = req.body;
	try {
		const query = "UPDATE jobs SET job = $1 ,job_status = $2 WHERE id = $3 RETURNING *";
		const job = await pool.query(query, [job_context, job_status, job_id]);
		res.status(200).json(job.rows[0]);
	} catch (error) {
		next(error);
	}
}

// @desc    Delete single user job
// @route   POST /api/v1/jobs/delete/:job_id
// @access  protected
export async function deleteJob(req: Request<{ job_id: number }, never, null>, res: Response, next: NextFunction) {
	const { job_id } = req.params;
	try {
		const query = "DELETE FROM jobs WHERE id = $1";
		const job = await pool.query(query, [+job_id]);
		res.status(200).json(job.rows[0]);
	} catch (error) {
		next(error);
	}
}
