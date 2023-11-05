export interface registerUserPayload {
	// username: string;
	email: string;
	password: string;
	token: string;
}
export interface loginUserPayload {
	email: string;
	password: string;
}

export type googleUser = {
	id: string;
	displayName: string;
	name: {
		familyName: string;
		givenName: string;
	};
	emails: Array<{
		value: string;
		verified: boolean;
	}>;
	photos: Array<{
		value: string;
	}>;
	provider: string;
	_raw: string;
	_json: {
		sub: string;
		name: string;
		given_name: string;
		family_name: string;
		picture: string;
		email: string;
		email_verified: boolean;
		locale: string;
	};
};

export type linkedinUser = {
	provider: string;
	id: string;
	email: string;
	givenName: string;
	familyName: string;
	displayName: string;
	picture: string;
	_raw: string;
	_json: {
		sub: string;
		email_verified: boolean;
		name: string;
		locale: {
			country: string;
			language: string;
		};
		given_name: string;
		family_name: string;
		email: string;
		picture: string;
	};
};
