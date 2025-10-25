import { ExpensesService } from "../services/expenses.service.js";

export const ExpensesController = {
  // ➕ Créer une dépense
  async create(req, res) {
    try {
      const expense = await ExpensesService.createExpense(req.body);
      return res.status(201).json({
        success: true,
        message: "Dépense créée avec succès ✅",
        data: expense,
      });
    } catch (error) {
      console.error("Erreur création dépense:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // 📋 Lister les dépenses d'une boutique
  async list(req, res) {
    try {
      const { shopId } = req.params;
      const expenses = await ExpensesService.getExpensesByShop(shopId);
      return res.status(200).json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      console.error("Erreur récupération dépenses:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Détail d'une dépense
  async getById(req, res) {
    try {
      const { id } = req.params;
      const expense = await ExpensesService.getExpenseById(id);
      return res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      console.error("Erreur récupération dépense:", error);
      return res.status(404).json({ success: false, message: error.message });
    }
  },

  // ✏️ Modifier une dépense
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedExpense = await ExpensesService.updateExpense(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Dépense mise à jour avec succès ✅",
        data: updatedExpense,
      });
    } catch (error) {
      console.error("Erreur mise à jour dépense:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // ❌ Supprimer une dépense
  async remove(req, res) {
    try {
      const { id } = req.params;
      await ExpensesService.deleteExpense(id);
      return res.status(200).json({
        success: true,
        message: "Dépense supprimée avec succès 🗑️",
      });
    } catch (error) {
      console.error("Erreur suppression dépense:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
