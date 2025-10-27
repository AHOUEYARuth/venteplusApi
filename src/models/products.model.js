import prisma from "../prismaClient.js";
import { ObjectId } from "bson"; 

export const ProductModel = {
  
  async create(data) {
    return prisma.product.create({ data });
  },

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        shop: true,
      },
    });
  },

  async findByName(name) {
    return prisma.product.findFirst({ where: { name } });
  },

  async update(id, data) {
    return prisma.product.update({ where: { id }, data });
  },

  
  async delete(id) {
    return prisma.product.delete({ where: { id } });
  },

  
  async findAll() {
    return prisma.product.findMany({
      include: {
        category: true,
        shop: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // async findByShop(shopId, filters = {}) {
  // const { name, categoryId, dateFrom, dateTo } = filters;

  // // Construction dynamique du where
  // const where = {
  //   shopId,
  //   ...(name && { name: { contains: name, mode: "insensitive" } }),
  //   ...(categoryId && { categoryId: new ObjectId(categoryId) }),
  //   ...(dateFrom || dateTo
  //     ? {
  //         createdAt: {
  //           ...(dateFrom && { gte: new Date(dateFrom) }),
  //           ...(dateTo && { lte: new Date(dateTo) }),
  //         },
  //       }
  //     : {}),
  // };

  //   return prisma.product.findMany({
  //     where,
  //     include: {
  //       category: true,
  //       shop: true,
  //     },
  //     orderBy: { createdAt: "desc" },
  //   });
  // },
  
  async findByCategory(categoryId) {
    return prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
  },
 
  async findByShop(shopId,filters = {}) {
   const { name, categoryId, dateFrom, dateTo } = filters;
   const where = {
    shopId,
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(categoryId && { categoryId: categoryId }),
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom && { gte: new Date(dateFrom.split("-").reverse().join("-"))  }),
            ...(dateTo && { lte: new Date(dateTo.split("-").reverse().join("-")) }),
          },
        }
      : {}),
    };
    return prisma.product.findMany({
      where,
      include: {category:true},
      orderBy: { createdAt: "desc" },
    });
  },
 
  async findLowStock(shopId) {
    return prisma.product.findMany({
      where: {
        shopId,
        availableQuantity: { lte: prisma.product.fields.minimumQuantity },
      },
    });
  },
};
