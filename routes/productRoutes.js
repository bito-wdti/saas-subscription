import { Router } from "express";
import { ProductController } from "../controllers/productController.js";

const router = Router();

// ─── Rotas públicas ──────────────────────────────────────────────────────────
router.get('/', ProductController.list);

export default router;