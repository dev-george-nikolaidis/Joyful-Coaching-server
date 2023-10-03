export interface Job {
	job_context: string;
	job_status?: boolean;
	user_id: number;
}
export interface updateJob {
	user_id: number;
	job_id: number;
	job_context: string;
	job_status?: boolean;
}
