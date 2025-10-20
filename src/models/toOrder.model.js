// models/ToOrderModel.js
import prisma from "../prismaClient.js";

export const ToOrderModel = {
  async create(data) {
    return prisma.toOrder.create({ data });
  },

  async createMultiple(items) {
    return prisma.toOrder.createMany({ data: items });
  },

  async findById(id) {
    return prisma.toOrder.findUnique({ 
      where: { id },
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: true
              }
            }
          }
        },
        product: true
      }
    });
  },

  async update(id, data) {
    return prisma.toOrder.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.toOrder.delete({ where: { id } });
  },

  async findByOrder(orderId) {
    return prisma.toOrder.findMany({ 
      where: { orderId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  },

  async findByProduct(productId) {
    return prisma.toOrder.findMany({ 
      where: { productId },
      include: {
        order: {
          include: {
            customer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async findByOrderAndProduct(orderId, productId) {
    return prisma.toOrder.findFirst({ 
      where: { 
        orderId,
        productId 
      },
      include: {
        product: true
      }
    });
  },

  async updateQuantity(orderId, productId, quantity) {
    return prisma.toOrder.updateMany({
      where: { 
        orderId,
        productId 
      },
      data: { quantity }
    });
  },

  async deleteByOrderAndProduct(orderId, productId) {
    return prisma.toOrder.deleteMany({
      where: { 
        orderId,
        productId 
      }
    });
  },

  async getOrderTotal(orderId) {
    const items = await prisma.toOrder.findMany({
      where: { orderId },
      include: {
        product: true
      }
    });

    return items.reduce((total, item) => {
      const price = item.unitPrice || item.product.salePrice;
      return total + (price * item.quantity);
    }, 0);
  },

  async getProductSalesStats(productId) {
    const items = await prisma.toOrder.findMany({
      where: { productId },
      include: {
        order: true,
        product: true
      }
    });

    const totalSold = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = items.reduce((sum, item) => {
      const price = item.unitPrice || item.product.salePrice;
      return sum + (price * item.quantity);
    }, 0);

    return {
      totalSold,
      totalRevenue,
      averageQuantity: totalSold / items.length || 0
    };
  }
};