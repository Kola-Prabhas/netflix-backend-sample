import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import Stripe from 'stripe';
import authRoutes from './routes/auth.routes.js';

import movieRoutes from './routes/movie.routes.js';
import tvRoutes from './routes/tv.routes.js';
import searchRoutes from './routes/search.routes.js';
import subscriptionRoutes from './routes/subscription.js';
import { connectDB } from './config/db.js';
import { ENV_VARS } from './config/envVars.js';
import { protectRoute } from './middleware/protectRoute.js';

const app = express();
dotenv.config();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();


// Stripe Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
	let event = request.body;
	// Only verify the event if you have an endpoint secret defined.
	// Otherwise use the basic event deserialized with JSON.parse
	if (endpointSecret) {
		// Get the signature sent by Stripe
		const signature = request.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(
				request.body,
				signature,
				endpointSecret
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`, err.message);
			return response.sendStatus(400);
		}
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
			console.log({ paymentIntent });
			// Then define and call a method to handle the successful payment intent.
			// handlePaymentIntentSucceeded(paymentIntent);
			break;
		case 'payment_method.attached':
			const paymentMethod = event.data.object;
			// Then define and call a method to handle the successful attachment of a PaymentMethod.
			// handlePaymentMethodAttached(paymentMethod);
			break;
		default:
			// Unexpected event type
			console.log(`Unhandled event type ${event.type}.`);
	}

	// Return a 200 response to acknowledge receipt of the event
	response.send();
});


app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: process.env.FRONTEND_URL, // Change this to your frontend URL
	credentials: true, // Allow cookies to be sent
}))


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);
app.use('/api/v1/subscription', protectRoute, subscriptionRoutes);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET);



app.post("/api/v1/create-payment-intent", async (req, res) => {
	const { totalAmount } = req.body;

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(totalAmount * 100),
		currency: "usd",
		// In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

app.listen(5000, () => {
	console.log('app started at port http://localhost:' + PORT);
	connectDB();
});