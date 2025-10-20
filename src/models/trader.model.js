import prisma from "../prismaClient.js";

export const TraderModel = {
  /**
   * Crée un trader
   * @param {Object} data - Données du trader (identityCard, userId, etc.)
   */
  async create(data) {
    return prisma.trader.create({ data });
  },

  /**
   * Trouve un trader par son ID
   * @param {string} id - ID du trader
   */
  async findById(id) {
    return prisma.trader.findUnique({
      where: { id },
      include: {
        user: true,   // Inclut les infos du User
        shop: true,   // Inclut la boutique associée
      },
    });
  },

  /**
   * Trouve un trader par ID utilisateur
   * (utile pour relier un User à son Trader)
   * @param {string} userId
   */
  async findByUserId(userId) {
    return prisma.trader.findUnique({
      where: { userId },
      include: { shop: true },
    });
  },

  /**
   * Met à jour un trader
   * @param {string} id - ID du trader
   * @param {Object} data - Données à mettre à jour
   */
  async update(id, data) {
    return prisma.trader.update({
      where: { id },
      data,
    });
  },

  /**
   * Supprime un trader
   * @param {string} id - ID du trader
   */
  async delete(id) {
    return prisma.trader.delete({
      where: { id },
    });
  },

  /**
   * Liste tous les traders (optionnel)
   */
  async findAll() {
    return prisma.trader.findMany({
      include: {
        user: true,
        shop: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
