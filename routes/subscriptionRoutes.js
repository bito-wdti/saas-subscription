import { Router } from "express";
import { subscriptionController } from "../controllers/subscriptionController.js";
import { stripeCustomerMiddleware } from "../middlewares/customerMiddleware.js";

const router = Router();

// ─── Rotas públicas ──────────────────────────────────────────────────────────
router.get('/', stripeCustomerMiddleware, subscriptionController.list);

export default router;
