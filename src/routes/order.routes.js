import express from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();

router.post("/", authMiddleware,OrderController.create);
router.get("/:id", authMiddleware,OrderController.getById);
router.get("/shop/:shopId", authMiddleware,OrderController.getByShop);
router.put("/:id", authMiddleware,OrderController.update);
router.delete("/:id", authMiddleware,OrderController.delete);
router.get("/statistics/:shopId",authMiddleware, OrderController.getStatistics);
router.get("/month-sales/:shopId", authMiddleware,OrderController.getMonthlySales);
router.get("/days-statistics/:shopId",authMiddleware, OrderController.getDaysStatistics);
router.put("/cancel/:orderId",authMiddleware, OrderController.cancelOrder);
router.put("/confirm/:orderId",authMiddleware, OrderController.confirmeOrder);

export default router;
