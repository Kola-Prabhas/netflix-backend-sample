import { User } from '../models/user.model.js';


export const createSubscription = async (req, res) => {
	const { type, price, expiresOn, paymentStatus, userId } = req.body;

	if (!type || !price || !expiresOn|| !userId) {
		return res.status(400).json({ success: false, message: 'All fields are required' });
	}

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		const newSubscription = {
			type,
			price,
			expiresOn,
			paymentStatus: 'unpaid',
		};

		user.subscription = newSubscription;
		const result = await user.save();

		res.json({
			success: true,
			data: {
				user: result
			}
		});
	} catch (error) {
		console.log('err ', error);

		res.status(500).json({
			success: false,
			message: 'Server error',
			error
		});
	}
}

export const markSubscriptionAsPaid = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({ success: false, message: 'Subscription ID is required' });
	}

	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		user.subscription.paymentStatus = 'paid';
		const result = await user.save();

		res.status(200).json({
			success: true,
			data: {
				user: result
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error
		});
	}
}