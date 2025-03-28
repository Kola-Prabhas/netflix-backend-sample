import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies["jwt-netflix"];

		// console.log('req.cookies', req.cookies);

		// console.log('token', token);

		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized - No Token provided" });
		}
		const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
		if (!decoded) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized - Invalid Token" });
		}
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protect Route Middleware : ", error.message);
		res.status(500).json({ success: false, message: "Internal server Error" });
	}
};