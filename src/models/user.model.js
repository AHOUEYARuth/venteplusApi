// models/UserModel.js
import prisma from "../prismaClient.js";

export const UserModel = {
  async create(data) {
    return prisma.user.create({ data });
  },

    async findByPhoneNumber(phoneNumber) {
      return prisma.user.findUnique({ where: { phoneNumber }, include:{trader: true}});
  },

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  },

  async findAll() {
    return prisma.user.findMany();
  },

  async findByRole(role) {
    return prisma.user.findMany({ where: { role } });
  }
};