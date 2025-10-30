import prisma from "../prismaClient.js";

export const TraderModel = {
  async create(data) {
    return prisma.trader.create({ data });
  },

  async findById(id) {
    return prisma.trader.findUnique({
      where: { id },
      include: {
        user: true,    
        shop: true,   
      },
    });
  },
 
  async findByUserId(userId) {
    return prisma.trader.findUnique({
      where: { userId },
      include: { shop: true },
    });
  },

 
  async update(id, data) {
    return prisma.trader.update({
      where: { id },
      data,
    });
  },

 
  async delete(id) {
    return prisma.trader.delete({
      where: { id },
    });
  },

 
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
