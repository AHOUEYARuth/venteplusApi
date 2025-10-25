import express from "express";
import { ExpensesController } from "../controllers/expenses.controller.js";

const router = express.Router();

router.post("/", ExpensesController.create);
router.get("/shop/:shopId", ExpensesController.list);
router.get("/:id", ExpensesController.getById);
router.put("/:id", ExpensesController.update);
router.delete("/:id", ExpensesController.remove);

export default router;
