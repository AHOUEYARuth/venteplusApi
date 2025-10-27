import express from "express";
import { CustomerController } from "../controllers/customerController.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();

router.post("/",authMiddleware, CustomerController.createCustomer);
router.delete("/:id", authMiddleware,CustomerController.deleteCustomer);
router.get("/shop/:shopId",authMiddleware, CustomerController.listCustomers);

export default router;
