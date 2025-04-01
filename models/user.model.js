import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
		enum: ['basic', 'cinemax', 'ultraflix'],
	},
	price: {
		type: Number,
		required: true,
	},
	expiresOn: {
		type: Date,
		required: true,
	},
	paymentStatus: {
		type: String,
		required: true,
		enum: ['paid', 'unpaid'],
	},
});

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: Array,
		default: [],
	},
	subscription: {
		type: subscriptionSchema,
		default: null
	}
});

export const User = mongoose.model("User", userSchema);