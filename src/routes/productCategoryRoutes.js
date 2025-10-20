import express from "express";
import { ProductCategoryController } from "../controllers/productCategoryController.js";

const router = express.Router();


router.post("/", ProductCategoryController.create);
router.put("/:id", ProductCategoryController.update);
router.delete("/:id", ProductCategoryController.delete);
router.get("/shop/:shopId", ProductCategoryController.getByShop);

export default router;
