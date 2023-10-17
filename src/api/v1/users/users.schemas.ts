import { z } from "zod";

export const userRegisterSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
		password: z.string({ required_error: "Password is required" }).min(6, "Password is to small"),
		token: z
			.string({
				required_error: "token is required",
			})
			.min(1, "Token is to small"),
	}),
});

export const userLoginSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
		password: z.string({ required_error: "Password is required" }).min(6, "Small password"),
	}),
});

export const passwordResetSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
	}),
});
