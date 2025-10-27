
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
    const { customerId, status, dateFrom, dateTo, isSale } = filters;

    const where = {
      shopId,
      ...(customerId && { customerId }),
      ...(isSale && { isSale }),
      ...(status && { status }),
      ...(dateFrom || dateTo
        ? {
            orderDate: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
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

