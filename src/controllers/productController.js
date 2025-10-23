import { ProductService } from "../services/productService.js";

export const ProductController = {
  async create(req, res) {
    try {
      // const productImage = req.file;
      const productImage = req.files?.["productImage"]?.[0];
      const product = await ProductService.createProduct({
        ...req.body,
        image: productImage ? productImage.path : null,
      });
      return res.status(201).json({
        message: "Produit créé avec succès ✅",
        data: product,
      });
    } catch (error) {
      console.error("Erreur création produit:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ProductService.updateProduct(id, req.body);
      return res.status(200).json({
        message: "Produit mis à jour avec succès ✅",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur mise à jour produit:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      return res.status(200).json({
        message: "Produit supprimé avec succès 🗑️",
      });
    } catch (error) {
      console.error("Erreur suppression produit:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async getByShop(req, res) {
    try {
      const { shopId } = req.params;
      const { name, categoryId, dateFrom, dateTo } = req.query;
      const filters = { name, categoryId, dateFrom, dateTo };
      const products = await ProductService.getProductsByShop(shopId, filters);
      return res.status(200).json({
        message: "Produits de la boutique récupérés ✅",
        data: products,
      });
    } catch (error) {
      console.error("Erreur récupération produits:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await ProductService.getProductsByCategory(categoryId);
      return res.status(200).json({
        message: "Produits de la catégorie récupérés ✅",
        data: products,
      });
    } catch (error) {
      console.error("Erreur récupération produits:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async getLowStock(req, res) {
    try {
      const { shopId } = req.params;
      const products = await ProductService.getLowStockProducts(shopId);
      return res.status(200).json({
        message: "Produits avec stock faible ✅",
        data: products,
      });
    } catch (error) {
      console.error("Erreur récupération stock faible:", error);
      return res.status(400).json({ message: error.message });
    }
  },
};
