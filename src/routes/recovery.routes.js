import express from "express";
import { RecoveryController } from "../controllers/recovery.controller.js";

const router = express.Router();
 
router.post("/", RecoveryController.create);
router.get("/:customerCreditId", RecoveryController.findAllByCustomerCredit);
export default router;
