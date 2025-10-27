import express from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", OrderController.create);
router.get("/:id", OrderController.getById);
router.get("/shop/:shopId", OrderController.getByShop);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);
router.get("/statistics/:shopId", OrderController.getStatistics);
router.get("/month-sales/:shopId", OrderController.getMonthlySales);

export default router;
