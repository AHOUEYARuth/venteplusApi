// models/ShopModel.js
import prisma from "../prismaClient.js";

export const ShopModel = {
  async create(data) {
    return prisma.shop.create({ data });
  },

  async findById(id) {
    return prisma.shop.findUnique({
      where: { id },
      include: {
        expenses: true,
      },
    });
  },

  async update(id, data) {
    return prisma.shop.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.shop.delete({ where: { id } });
  },

  async findAll() {
    return prisma.shop.findMany({
      include: {
        trader: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async findByTrader(traderId) {
    return prisma.traderShop.findMany({
      where: { traderId },
      include: {
        shop: {
          include: {
            expenses: true,
          },
        },
        trader: true,
      },
    });
  },
};