import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAnsSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt-netflix", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "None",
		// secure: ENV_VARS.NODE_ENV == "production",
		secure: true,
	});
	return token;
};