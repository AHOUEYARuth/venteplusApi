import express from "express";
import { CustomerCreditsController } from "../controllers/customerCreditsController.js";

const router = express.Router();

router.post("/", CustomerCreditsController.create);
router.delete("/:id", CustomerCreditsController.delete);
router.get("/shop/:shopId", CustomerCreditsController.listByShop);

export default router;
