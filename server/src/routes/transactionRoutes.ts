
import express from 'express';

import { createStripePaymentIntent, createTransaction } from '../controllers/transactionController';
const router = express.Router();

// these serve as routes for course controller, like an intermediary

router.post("/", createTransaction);
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;