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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',  
		required: true, 
	},
});


export const Subscription = mongoose.model("Subscription", subscriptionSchema);