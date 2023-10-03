import { z } from "zod";

export const userRegisterSchema = z.object({
	body: z.object({
		username: z
			.string({
				required_error: "username is required",
			})
			.min(1),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
		password: z.string({ required_error: "Password is required" }).min(6),
	}),
});

export const userLoginSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
		password: z.string({ required_error: "Password is required" }).min(6),
	}),
});
