import { Router } from "express";
import { SubscriptionController } from "../controllers/subscriptionController.js";
import { stripeCustomerMiddleware } from "../middlewares/customerMiddleware.js";

const router = Router();

// ─── Rotas públicas ──────────────────────────────────────────────────────────
router.post('/', stripeCustomerMiddleware, SubscriptionController.create);

export default router;