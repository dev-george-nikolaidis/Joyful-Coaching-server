import { z } from "zod";

export const contactUsSchema = z.object({
	body: z.object({
		name: z
			.string({
				required_error: "name is required",
			})
			.min(2),
		subject: z
			.string({
				required_error: "subject is required",
			})
			.min(2),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
		textarea: z
			.string({
				required_error: "Message is required",
			})
			.min(20),
		token: z.string({
			required_error: "Token is required",
		}),
	}),
});
