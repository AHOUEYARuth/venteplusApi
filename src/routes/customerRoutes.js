import express from "express";
import { CustomerController } from "../controllers/customerController.js";

const router = express.Router();

router.post("/", CustomerController.createCustomer);
router.delete("/:id", CustomerController.deleteCustomer);
router.get("/", CustomerController.listCustomers);

export default router;
