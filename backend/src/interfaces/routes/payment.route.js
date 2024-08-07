import express from 'express';
import { createCheckoutSession, handleStripeWebhook } from '../../interfaces/controllers/payment.controller.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

// Route to handle Stripe webhook events
router.post('/webhook', (req, res) => handleStripeWebhook(req, res, req.io));

export default router;
