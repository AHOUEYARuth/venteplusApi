import prisma from "../prismaClient.js";
import { ObjectId } from "bson";

export const CustomerCreditsModel = {
  async create(data) {
    return prisma.customerCredits.create({ data });
  },

  async findAll(shopId,filters = {}) {
    const { name, dateFrom, dateTo } = filters;
 
    const where = {
       shopId,
       
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: new Date(dateFrom.split("-").reverse().join("-")) }),
              ...(dateTo && { lte: new Date(dateTo.split("-").reverse().join("-")) }),
            },
          }
        : {}),
      ...(name && {
        customer: {
          OR: [
            { name: { contains: name, mode: "insensitive" } },
            { firstName: { contains: name, mode: "insensitive" } },
          ],
        },
      }),
    };

    return prisma.customerCredits.findMany({
      where,
      include: {
        customer: true,
      
        order:{
           include: {
             toOrders: {
               include: {
                  product: true
               }
             }
           }
        },
      
        shop: true
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    return prisma.customerCredits.findUnique({
      where: { id },
      include: { customer: true, order: true, shop: true },
    });
  },

  async update(id, data) {
    return prisma.customerCredits.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.customerCredits.delete({ where: { id } });
  },
};
