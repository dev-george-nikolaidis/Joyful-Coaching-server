export const usersModel = `
CREATE TYPE strategies AS ENUM ('local', 'google', 'facebook','linkedin');
CREATE TYPE roles AS ENUM ('user', 'admin', 'owner');
CREATE TABLE IF NOT EXISTS  users(
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	password TEXT,
	role roles DEFAULT 'user',
	login_strategy strategies DEFAULT Null,
	appointments  smallint default 0 CHECK(appointments >= 0),
	password_reset_token TEXT DEFAULT '',
	created_on timestamp default CURRENT_TIMESTAMP not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null

)
`;

export const appointments = `
CREATE TABLE IF NOT EXISTS  appointments(
	id SERIAL PRIMARY KEY,
	date DATE  NOT NULL,
	appointment  smallserial NOT NULL ,
	user_id integer NOT NULL,
	 FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE
    ON DELETE RESTRICT

)
`;

export const contract = `
CREATE TABLE IF NOT EXISTS  contact(
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	subject TEXT NOT NULL,
	email TEXT NOT NULL ,
	textarea TEXT NOT NULL,
	created_on timestamp default CURRENT_TIMESTAMP not null
)`;

export const newsletter = `
CREATE TABLE IF NOT EXISTS  newsletter(
	id SERIAL PRIMARY KEY,
	email text  NOT NULL
)`;

// drop schema public cascade;
// create schema public;
