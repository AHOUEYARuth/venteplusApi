import express from "express";
import { TraderController } from "../controllers/traderController.js";
import validateRequest from "../middlewares/validateRequests.js";
import { registerValidation } from "../validators/authValidator.js";
import upload from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();

router.post('/register',   upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'identityCard', maxCount: 1 },
    { name: 'imageShop', maxCount: 1 },
  ]),  TraderController.register);

router.post('/register-employe',   upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'identityCard', maxCount: 1 },
]),  TraderController.registerEmploye);

router.get("/shop/:shopId",authMiddleware, TraderController.getTradersByShop);
router.post("/validate-employee/:traderId",authMiddleware, TraderController.validateTrader);

export default router;
