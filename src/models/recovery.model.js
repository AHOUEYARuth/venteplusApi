// models/RecoveryModel.js
import prisma from "../prismaClient.js";

export const RecoveryModel = {
  async create(data) {
    return prisma.recovery.create({ data });
  },

  async findById(id) {
    return prisma.recovery.findUnique({ 
      where: { id },
      include: {
        customerCredit: {
          include: {
            customer: true
          }
        }
      }
    });
  },

  async update(id, data) {
    return prisma.recovery.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.recovery.delete({ where: { id } });
  },

  async findByCustomerCredit(customerCreditId) {
    return prisma.recovery.findMany({ 
      where: { customerCreditId },
      include: {
        customerCredit: true
      }
    });
  }
};