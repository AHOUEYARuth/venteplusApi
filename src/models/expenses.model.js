import prisma from "../prismaClient.js";

export const ExpensesModel = {
  async create(data) {
    return prisma.expenses.create({ data });
  },
  
  async findAll(shopId,filters = {}) {
    const { dateFrom, dateTo } = filters;
    const where = {
    shopId,
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom && { gte: new Date(dateFrom.split("-").reverse().join("-"))  }),
            ...(dateTo && { lte: new Date(dateTo.split("-").reverse().join("-")) }),
          },
        }
      : {}),
    };
    return prisma.expenses.findMany({
      where,
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
