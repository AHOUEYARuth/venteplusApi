import prisma from "../prismaClient.js";

export const RecoveryModel = {
  async create(data, tx = prisma) {
    return tx.recovery.create({
      data,
      include: {
        customerCredit: { include: { customer: true, shop: true, order: true } },
      },
    });
  },

  async findByCustomerCredit(customerCreditId, tx = prisma) {
    return tx.recovery.findMany({
      where: { customerCreditId },
      include: {
        customerCredit: { include: { customer: true, shop: true, order: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id, tx = prisma) {
    return tx.recovery.findUnique({
      where: { id },
      include: {
        customerCredit: { include: { customer: true, shop: true, order: true } },
      },
    });
  },

  async update(id, data, tx = prisma) {
    return tx.recovery.update({
      where: { id },
      data,
      include: {
        customerCredit: { include: { customer: true, shop: true, order: true } },
      },
    });
  },

  async delete(id, tx = prisma) {
    return tx.recovery.delete({ where: { id } });
  },
};
