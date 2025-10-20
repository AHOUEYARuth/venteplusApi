// models/ExpensesModel.js
import prisma from "../prismaClient.js";

export const ExpensesModel = {
  async create(data) {
    return prisma.expenses.create({ data });
  },

  async findById(id) {
    return prisma.expenses.findUnique({ 
      where: { id },
      include: {
        shop: true
      }
    });
  },

  async update(id, data) {
    return prisma.expenses.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.expenses.delete({ where: { id } });
  },

  async findAll() {
    return prisma.expenses.findMany({
      include: {
        shop: true
      }
    });
  },

  async findByShop(shopId) {
    return prisma.expenses.findMany({ 
      where: { shopId },
      include: {
        shop: true
      }
    });
  },

  async findByDateRange(startDate, endDate) {
    return prisma.expenses.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        shop: true
      }
    });
  }
};