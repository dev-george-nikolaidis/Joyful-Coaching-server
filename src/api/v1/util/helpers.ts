import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function calculateAppointmentTime(d: Date, hour: string, minutes: string) {
	const date = new Date(d);
	const day = date.getDate().toString();
	const month = (date.getMonth() + 1).toString();
	const year = date.getFullYear().toString();

	// The string format should be: YYYY-MM-DDTHH:mm:ss.sssZ,
	const customDate = new Date(`${year}-${month}-${day} ${hour}:${minutes}`);
	return customDate;
	// return customDate;
}

export const convertAppointmentNumberToDate = (num: number, d: Date) => {
	let date = null;
	switch (num) {
		case 1:
			date = calculateAppointmentTime(d, "07", "00");
			break;
		case 2:
			date = calculateAppointmentTime(d, "08", "30");
			break;
		case 3:
			date = calculateAppointmentTime(d, "10", "00");
			break;
		case 4:
			date = calculateAppointmentTime(d, "11", "30");
			break;
		case 5:
			date = calculateAppointmentTime(d, "13", "00");
			break;

		default:
			date = calculateAppointmentTime(d, "16", "00");
			break;
	}

	return date;
};

// Generate JWT
export const generateToken = (id: any, customExpirationTime?: number) => {
	const jwtSecret = process.env.JWT_SECRET!;

	let jwtExpTime;
	if (customExpirationTime) {
		jwtExpTime = customExpirationTime;
	} else {
		jwtExpTime = process.env.JWT_TOKEN_EXPIRATION;
	}

	return jwt.sign({ id }, jwtSecret, {
		expiresIn: jwtExpTime,
	});
};

// Generate refresh  JWT token
export const generateRefreshToken = (id: string) => {
	return jwt.sign({ id: id }, process.env.JWT_REFRESH_SECRET!, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
	});
};
