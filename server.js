import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.routes.js';

import movieRoutes from './routes/movie.routes.js';
import tvRoutes from './routes/tv.routes.js';
import searchRoutes from './routes/search.routes.js';
import { connectDB } from './config/db.js';
import { ENV_VARS } from './config/envVars.js';
import { protectRoute } from './middleware/protectRoute.js';

const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173", // Change this to your frontend URL
	credentials: true, // Allow cookies to be sent
}))

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/dist')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
	});
}

app.listen(5000, () => {
	console.log('Server started at port http://localhost:' + PORT);
	connectDB();
});