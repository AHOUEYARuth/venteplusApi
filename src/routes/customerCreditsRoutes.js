import express from "express";
import { CustomerCreditsController } from "../controllers/customerCredits.controller.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();

router.post("/",authMiddleware, CustomerCreditsController.create);
router.get("/:id",authMiddleware, CustomerCreditsController.getById);
router.get("/shop/:shopId", authMiddleware,CustomerCreditsController.getAll);
router.put("/:id",authMiddleware, CustomerCreditsController.update);
router.delete("/:id", authMiddleware,CustomerCreditsController.delete);

export default router;
