
import { OrderStatus } from "@prisma/client";
import prisma from "../prismaClient.js";

export const OrderModel = {
  async create(data) {
    return prisma.order.create({
      data,
      include: {
        customer: true,
        shop: true,
        customerCredit: true,
        toOrders: {
          include: { product: true },
        },
      },
    });
  },

  async findAll(shopId,filters = {}) {
    const { customerId, status, dateFrom, dateTo, isSale,search } = filters;

    const where = {
      shopId,
      isSale,
      ...(customerId && { customerId }),
      ...(status && { status }),
      ...(dateFrom || dateTo
        ? {
            orderDate: {
              ...(dateFrom && { gte: new Date(dateFrom.split("-").reverse().join("-")) }),
              ...(dateTo && { lte: new Date(dateTo.split("-").reverse().join("-")) }),
            },
          }
        : {}),
    ...(search && {
      OR: [
       
        {
          customer: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
    
        {
          toOrders: {
            some: {
              product: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ],
    }),
    };

    return prisma.order.findMany({
      where,
      include: {
        customer: true,
        shop: true,
        toOrders: { include: { product: true } },
        customerCredit: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        shop: true,
        toOrders: { include: { product: true } },
        customerCredit: true,
      },
    });
  },

  async update(id, data) {
    return prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        shop: true,
        toOrders: { include: { product: true } },
        customerCredit: true,
      },
    });
  },

  async cancelOrder(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Commande introuvable");
 
    if (order.status === OrderStatus.CANCELLED)
      throw new Error("Cette commande est déjà annulée");
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CONFIRMED)
      throw new Error("Impossible d’annuler une commande déjà livrée");
 
    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    return cancelledOrder;
  },

  async delete(id) {
    return prisma.order.delete({ where: { id } });
  },
};

// import prisma from "../prismaClient.js";

// export const OrderModel = {
//   async create(data) {
//     return prisma.order.create({ data });
//   },

//   async findById(id) {
//     return prisma.order.findUnique({
//       where: { id },
//       include: {
//         customer: true,
//         shop: true,
//         customerCredit: true,
//       },
//     });
//   },

//   async findByShop(shopId,isPaid) {
//     return prisma.order.findMany({
//       where: { shopId ,isPaid},
//       include: {
//         customer: true,
//         customerCredit: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });
//   },

//   async update(id, data) {
//     return prisma.order.update({
//       where: { id },
//       data,
//     });
//   },

//   async delete(id) {
//     return prisma.order.delete({
//       where: { id },
//     });
//   },
// };

