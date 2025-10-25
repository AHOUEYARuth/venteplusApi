import express from "express";
import { CustomerCreditsController } from "../controllers/customerCredits.controller.js";

const router = express.Router();

router.post("/", CustomerCreditsController.create);
router.get("/:id", CustomerCreditsController.getById);
router.get("/shop/:shopId", CustomerCreditsController.getAll);
router.put("/:id", CustomerCreditsController.update);
router.delete("/:id", CustomerCreditsController.delete);

export default router;
