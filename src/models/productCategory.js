import prisma from "../prismaClient.js";

export const ProductCategoryModel = {
  async create(data) {
    return prisma.productCategory.create({ data });
  },

  async findById(id) {
    return prisma.productCategory.findUnique({
      where: { id },
      include: { products: true },
    });
  },

  async findByName(name) {
    return prisma.productCategory.findFirst({ where: { name } });
  },

  async update(id, data) {
    return prisma.productCategory.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.productCategory.delete({ where: { id } });
  },

  async findAll() {
    return prisma.productCategory.findMany({
      include: { products: true },
    });
  },

  // 🔍 Récupérer toutes les catégories d’une boutique spécifique
  async findAllByShop(shopId) {
    return prisma.productCategory.findMany({
      where: { shopId },
      include: { products: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
