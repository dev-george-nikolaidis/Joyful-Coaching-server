import axios from "axios";
import { NextFunction, Request, Response } from "express";

// @desc    get  user
// @route   GET /api/v1/products/:categoryId
// @access  public

export async function getProductsByCategory(req: Request<{ categoryId: string; limit?: string }, never>, res: Response, next: NextFunction) {
	const { categoryId, limit } = req.params;

	const options = {
		method: "GET",
		url: "https://asos2.p.rapidapi.com/products/v2/list",
		params: {
			categoryId: categoryId,
			limit: limit ? limit : "60",
			country: "US",
			sort: "freshness",
			currency: "USD",
			sizeSchema: "US",
			lang: "en-US",
		},
		headers: {
			"X-RapidAPI-Key": process.env.ASOS_API_KEY,
			"X-RapidAPI-Host": process.env.ASOS_API_URL,
		},
	};

	try {
		const response = await axios(options);
		res.send(response.data);
	} catch (error) {
		next(error);
	}
}
