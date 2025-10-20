// models/CustomerCreditsModel.js
import prisma from "../prismaClient.js";

export const CustomerCreditsModel = {
  /**
   * Crée un crédit client
   * @param {Object} data - totalAmountToPay, customerId, amountPaid (optionnel)
   */
  async create(data) {
    return prisma.customerCredits.create({ data });
  },

  /**
   * Supprime un crédit client par ID
   * @param {string} id
   */
  async delete(id) {
    return prisma.customerCredits.delete({ where: { id } });
  },

  /**
   * Liste les crédits d'une boutique avec filtres optionnels
   * @param {Object} params - { shopId, customerId?, name?, startDate?, endDate? }
   */
  async findByShop({ shopId, customerId, name, startDate, endDate }) {
    const where = {
      customer: {
        shopId,
        ...(customerId && { id: customerId }),
        ...(name && {
          OR: [
            { name: { contains: name, mode: "insensitive" } },
            { firstName: { contains: name, mode: "insensitive" } }
          ]
        })
      },
      ...(startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) })
        }
      }
    };

    return prisma.customerCredits.findMany({
      where,
      include: {
        customer: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
};
