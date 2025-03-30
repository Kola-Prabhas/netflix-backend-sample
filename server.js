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

const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: ENV_VARS.FRONTEND_URL,
	credentials: true,
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);
app.use('/api/v1/subscription', protectRoute, subscriptionRoutes);

// Stripe Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET);

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
	let event = request.body;
	if (endpointSecret) {
		const signature = request.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`, err.message);
			return response.sendStatus(400);
		}
	}

	switch (event.type) {
		case 'payment_intent.succeeded':
			console.log(`PaymentIntent for ${event.data.object.amount} was successful!`);
			break;
		case 'payment_method.attached':
			console.log(`PaymentMethod attached.`);
			break;
		default:
			console.log(`Unhandled event type ${event.type}.`);
	}
	response.send();
});

// Stripe Payment Route
app.post("/api/v1/create-payment-intent", async (req, res) => {
	const { totalAmount } = req.body;
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(totalAmount * 100),
		currency: "usd",
		automatic_payment_methods: { enabled: true },
	});
	res.send({ clientSecret: paymentIntent.client_secret });
});

// Serve React App for all non-API routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Connect to Database & Start Server
connectDB();
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
