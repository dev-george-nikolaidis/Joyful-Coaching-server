export const usersModel = `
CREATE TABLE IF NOT EXISTS  users(
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role varchar DEFAULT 'user',
	appointments  smallint default 0,
	created_on timestamp default CURRENT_TIMESTAMP not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null

)
`;

export const appointments = `
CREATE TABLE IF NOT EXISTS  appointments(
	id SERIAL PRIMARY KEY,
	date DATE  NOT NULL,
	appointment  smallserial NOT NULL,
	user_id integer NOT NULL,
	 FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE
    ON DELETE RESTRICT

)
`;

// drop schema public cascade;
// create schema public;
