import express from 'express';
import {
	authCheck,
	login,
	logout,
	signup,
	getUser
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users/:id', protectRoute, getUser)

router.get('/authCheck', protectRoute, authCheck);
export default router;