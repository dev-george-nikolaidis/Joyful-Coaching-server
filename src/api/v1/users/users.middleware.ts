import { NextFunction, Request, Response } from "express";

export function example(req: Request, res: Response, next: NextFunction) {
	try {
		next();
	} catch (error) {
		next(error);
	}
}
