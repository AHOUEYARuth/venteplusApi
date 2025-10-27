import { ExpensesModel } from "../models/expenses.model.js";

export const ExpensesService = {
  async createExpense(data) {
    return await ExpensesModel.create(data);
  },

  async getExpensesByShop(shopId,filters = {}) {
    return await ExpensesModel.findAll(shopId,filters);
  },

  async getExpenseById(id) {
    const expense = await ExpensesModel.findById(id);
    if (!expense) throw new Error("Dépense introuvable");
    return expense;
  },

  async updateExpense(id, data) {
    const expense = await ExpensesModel.update(id, data);
    return expense;
  },

  async deleteExpense(id) {
    return await ExpensesModel.delete(id);
  },
};
