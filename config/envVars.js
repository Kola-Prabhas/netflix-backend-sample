import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARS = {
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	TMDB_API_KEY: process.env.TMDB_API_KEY,
	FRONTEND_URL: process.env.FRONTEND_URL
};