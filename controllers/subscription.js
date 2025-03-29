import { Subscription } from '../models/subscription.js';


export const createSubscription = async (req, res) => {
	const { type, price, expiresOn, paymentStatus, userId } = req.body;

	if (!type || !price || !expiresOn|| !userId) {
		return res.status(400).json({ success: false, message: 'All fields are required' });
	}

	try {
		const newSubscription = new Subscription({
			type,
			price,
			expiresOn,
			paymentStatus: 'unpaid',
			user: userId,
		});
		const subscription = await newSubscription.save();

		res.status(201).json({
			success: true,
			subscription
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error
		});
	}
}

export const markSubscriptionAsPaid = async (req, res) => {
	const { subscriptionId } = req.params;

	if (!subscriptionId) {
		return res.status(400).json({ success: false, message: 'Subscription ID is required' });
	}

	try {
		const subscription = await Subscription.findById(subscriptionId);

		if (!subscription) {
			return res.status(404).json({ success: false, message: 'Subscription not found' });
		}

		subscription.paymentStatus = 'paid';
		await subscription.save();

		res.status(200).json({
			success: true,
			subscription
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error
		});
	}
}