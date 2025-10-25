import prisma from "../prismaClient.js";

export const ExpensesModel = {
  async create(data) {
    return prisma.expenses.create({ data });
  },

  async findAll(shopId) {
    return prisma.expenses.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    return prisma.expenses.findUnique({
      where: { id },
    });
  },

  async update(id, data) {
    return prisma.expenses.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.expenses.delete({
      where: { id },
    });
  },
};
