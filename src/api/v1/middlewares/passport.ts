import dotenv from "dotenv";
import passport from "passport";
import facebook from "passport-facebook";
import google from "passport-google-oauth20";
import linkedIn from "passport-linkedin-oauth2";
dotenv.config();

const GoogleStrategy = google.Strategy;
const linkedInStrategy = linkedIn.Strategy;
const FacebookStrategy = facebook.Strategy;
export default function Strategies() {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
				callbackURL: `${process.env.BACKEND_API_URL}/users/auth/google/callback`,
			},
			function (_accessToken, _refreshToken, profile, cb) {
				return cb(null, profile);
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID!,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
				callbackURL: `${process.env.BACKEND_API_URL}/users/auth/facebook/callback`,
				profileFields: ["id", "displayName", "photos", "email"],
				enableProof: true,
			},
			function (_accessToken, _refreshToken, profile, cb) {
				return cb(null, profile);
			}
		)
	);

	passport.use(
		new linkedInStrategy(
			{
				clientID: process.env.LINKEDIN_CLIENT_ID!,
				clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
				callbackURL: `http://localhost:3001/api/v1/users/auth/linkedin/callback`,
				scope: ["email", "profile", "openid"],
			},
			function (_accessToken, _refreshToken, profile, done) {
				// asynchronous verification, for effect...
				process.nextTick(function () {
					// To keep the example simple, the user's LinkedIn profile is returned to
					// represent the logged-in user. In a typical application, you would want
					// to associate the LinkedIn account with a user record in your database,
					// and return that user instead.
					return done(null, profile);
				});
			}
		)
	);

	passport.serializeUser((user: any, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((user: any, done) => {
		done(null, user.id);
	});
}
