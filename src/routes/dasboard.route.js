import express from "express";
import { authMiddleware } from "../middlewares/auth.midleware.js";
import { getStatsDashboard } from "../controllers/dashboard.controller.js";
 
const router = express.Router();
router.get("/dashboard/:shopId", authMiddleware, getStatsDashboard);

export default router;
