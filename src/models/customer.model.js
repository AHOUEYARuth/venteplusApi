import prisma from "../prismaClient.js";

export const CustomerModel = {
  async create(data) {
    return prisma.customers.create({ data });
  },

  async findById(id) {
    return prisma.customers.findUnique({
      where: { id },
      include: {
        shop: true,
        customerCredits: true,
        orders: true,
      }
    });
  },

  async update(id, data) {
    return prisma.customers.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.customers.delete({ where: { id } });
  },

  async findAll() {
    return prisma.customers.findMany({
      include: {
        shop: true,
        customerCredits: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByShop(shopId,filters = {}) {
    const { name, dateFrom, dateTo } = filters;
 
    const where = {
       shopId,
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: new Date(dateFrom.split("-").reverse().join("-")) }),
              ...(dateTo && { lte: new Date(dateTo.split("-").reverse().join("-")) }),
            },
          }
        : {}),
      ...(name && {
          OR: [
            { name: { contains: name, mode: "insensitive" } },
            { firstName: { contains: name, mode: "insensitive" } },
          ],
        }),
    };
    return prisma.customers.findMany({
      where,
      include: {
        customerCredits: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
};
