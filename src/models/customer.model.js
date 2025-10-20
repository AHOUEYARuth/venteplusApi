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

  async findByShop(shopId) {
    return prisma.customers.findMany({
      where: { shopId },
      include: {
        customerCredits: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
};
