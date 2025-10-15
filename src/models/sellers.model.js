import prisma from "../prismaClient.js";

export const SellersModel = {
  async create(data) {
    return prisma.sellers.create({ data });
  },

  async findByPhoneNumber(phoneNumber) {
    return prisma.sellers.findUnique({ where: { phoneNumber } });
  },

  async findById(id) {
    return prisma.sellers.findUnique({ where: { id } });
  },

  async update(id, data) {
    return prisma.sellers.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.sellers.delete({ where: { id } });
  },
};