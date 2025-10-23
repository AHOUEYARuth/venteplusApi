import express from "express";
import { ProductController } from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

 
router.post("/", upload.single("productImage"),ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);
router.get("/shop/:shopId", ProductController.getByShop);
router.get("/category/:categoryId", ProductController.getByCategory);
router.get("/shop/:shopId/low-stock", ProductController.getLowStock);

export default router;
