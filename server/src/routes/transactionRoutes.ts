
import express from 'express';

import { createStripePaymentIntent, createTransaction, listTransactions } from '../controllers/transactionController';
const router = express.Router();

// these serve as routes for course controller, like an intermediary

router.get("/", listTransactions)
router.post("/", createTransaction);
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;