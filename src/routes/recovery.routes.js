import express from "express";
import { RecoveryController } from "../controllers/recovery.controller.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();
 
router.post("/", authMiddleware,RecoveryController.create);
router.get("/:customerCreditId",authMiddleware, RecoveryController.findAllByCustomerCredit);
export default router;
