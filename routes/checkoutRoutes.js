import { Router } from "express";
import { checkoutController } from "../controllers/checkoutController.js";
import { stripeCustomerMiddleware } from "../middlewares/customerMiddleware.js";

const router = Router();

// ─── Rotas públicas ──────────────────────────────────────────────────────────
router.post('/', stripeCustomerMiddleware, checkoutController.create);

export default router;  