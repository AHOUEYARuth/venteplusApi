import { ProductCategoryService } from "../services/productCategoryService.js";

export const ProductCategoryController = {
  async create(req, res) {
    try {
      const category = await ProductCategoryService.createCategory(req.body);
      return res.status(201).json({
        message: "Catégorie créée avec succès ✅",
        data: category,
      });
    } catch (error) {
      console.error("Erreur création catégorie:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la création de la catégorie",
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ProductCategoryService.updateCategory(id, req.body);
      return res.status(200).json({
        message: "Catégorie mise à jour avec succès ✅",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur mise à jour catégorie:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la mise à jour de la catégorie",
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProductCategoryService.deleteCategory(id);
      return res.status(200).json({
        message: "Catégorie supprimée avec succès 🗑️",
      });
    } catch (error) {
      console.error("Erreur suppression catégorie:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la suppression de la catégorie",
      });
    }
  },

  async getByShop(req, res) {
    try {
      const { shopId } = req.params;
      const categories = await ProductCategoryService.getCategoriesByShop(shopId);
      return res.status(200).json({
        message: "Liste des catégories de la boutique ✅",
        data: categories,
      });
    } catch (error) {
      console.error("Erreur récupération catégories:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la récupération des catégories",
      });
    }
  },
};
