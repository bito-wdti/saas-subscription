import { Router } from "express";
import { SubscriptionController } from "../controllers/subscriptionController.js";
import { stripeCustomerMiddleware } from "../middlewares/customerMiddleware.js";
import { paymentMethodMiddleware } from "../middlewares/paymentMethodMiddleware.js";

const router = Router();

// ─── Rotas públicas ──────────────────────────────────────────────────────────
router.post('/', stripeCustomerMiddleware, paymentMethodMiddleware, SubscriptionController.create);

export default router;