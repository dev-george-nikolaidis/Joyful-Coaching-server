import { z } from "zod";

export const jobSchema = z.object({
	body: z.object({
		job_context: z
			.string({
				required_error: "username is required",
			})
			.min(1),
		job_status: z.boolean({
			required_error: "status is required",
		}),
	}),
});

export const updateJobSchema = z.object({
	body: z.object({
		job_id: z.number({
			required_error: "job id is required",
		}),
		user_id: z.number({
			required_error: "user id is required",
		}),
		job_context: z
			.string({
				required_error: "username is required",
			})
			.min(1),
		job_status: z.boolean({
			required_error: "job is required",
		}),
	}),
});
