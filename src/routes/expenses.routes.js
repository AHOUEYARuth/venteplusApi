import express from "express";
import { ExpensesController } from "../controllers/expenses.controller.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();

router.post("/",authMiddleware, ExpensesController.create);
router.get("/shop/:shopId",authMiddleware, ExpensesController.list);
router.get("/:id",authMiddleware, ExpensesController.getById);
router.put("/:id",authMiddleware, ExpensesController.update);
router.delete("/:id",authMiddleware, ExpensesController.remove);

export default router;
