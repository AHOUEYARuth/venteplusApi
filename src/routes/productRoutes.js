import express from "express";
import { ProductController } from "../controllers/productController.js";
import upload from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.midleware.js";

const router = express.Router();


router.post("/",authMiddleware, upload.single("image"), ProductController.create);
router.put("/:id",authMiddleware, ProductController.update);
router.delete("/:id",authMiddleware, ProductController.delete);
router.get("/shop/:shopId", authMiddleware,ProductController.getByShop);
router.get("/category/:categoryId", authMiddleware,ProductController.getByCategory);
router.get("/shop/:shopId/low-stock", authMiddleware,ProductController.getLowStock);
router.get("/top-selling/:shopId",authMiddleware, ProductController.getTopSelling);

export default router;
