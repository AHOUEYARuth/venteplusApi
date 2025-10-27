import express from "express";
import { ProductCategoryController } from "../controllers/productCategoryController.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();


router.post("/", authMiddleware,ProductCategoryController.create);
router.put("/:id", authMiddleware,ProductCategoryController.update);
router.delete("/:id", authMiddleware,ProductCategoryController.delete);
router.get("/shop/:shopId",authMiddleware, ProductCategoryController.getByShop);

export default router;
