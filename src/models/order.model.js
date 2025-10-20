// models/OrderModel.js
import prisma from "../prismaClient.js";

export const OrderModel = {
  async create(data) {
    return prisma.order.create({ data });
  },

  async findById(id) {
    return prisma.order.findUnique({ 
      where: { id },
      include: {
        customer: true,
        toOrders: {
          include: {
            product: true
          }
        },
        sales: true
      }
    });
  },

  async update(id, data) {
    return prisma.order.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.order.delete({ where: { id } });
  },

  async findAll() {
    return prisma.order.findMany({
      include: {
        customer: true,
        toOrders: {
          include: {
            product: true
          }
        }
      }
    });
  },

  async findByCustomer(customerId) {
    return prisma.order.findMany({ 
      where: { customerId },
      include: {
        toOrders: {
          include: {
            product: true
          }
        }
      }
    });
  },

  async findByStatus(status) {
    return prisma.order.findMany({ where: { status } });
  }
};