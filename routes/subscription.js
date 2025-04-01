import express from "express";
import {
	createSubscription,
	markSubscriptionAsPaid,
} from "../controllers/subscription.js";

const router = express.Router();

router.post("/", createSubscription)
      .patch('/:userId', markSubscriptionAsPaid);

export default router;