
import { OrderStatus } from "@prisma/client";
import { OrderModel } from "../models/order.model.js";
import { ToOrderModel } from "../models/toOrder.model.js";
import prisma from "../prismaClient.js";

export const OrderService = {
async createOrder(data) {
    const {
      customerId,
      shopId,
      deliveryAddress,
      isSale,
      productId,
      quantity,
    } = data;

    return await prisma.$transaction(async (tx) => {
     
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produit introuvable");
 
      const totalAmount = product.salePrice * quantity;

 
      const order = await tx.order.create({
        data: {
          totalAmount,
          deliveryAddress,
          status: isSale === true ? OrderStatus.DELIVERED : OrderStatus.PENDING,
          customerId,
          shopId,
          isSale,
        },
      });
 
      await tx.toOrder.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
        },
      });
 
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          shop: true,
          toOrders: { include: { product: true } },
        },
      });
    });
  },

  async getAllOrders(filters) {
    return await OrderModel.findAll(filters);
  },

  async getOrderById(id) {
    return await OrderModel.findById(id);
  },

  async updateOrder(id, data) {
    return await OrderModel.update(id, data);
  },

  async deleteOrder(id) {
    return await OrderModel.delete(id);
  },
};


// import { OrderModel } from "../models/order.model.js";

// export const OrderService = {
//   async createOrder(data) {
//     return await OrderModel.create(data);
//   },

//   async getOrderById(id) {
//     return await OrderModel.findById(id);
//   },

//   async getOrdersByShop(shopId,isPaid) {
//     return await OrderModel.findByShop(shopId,isPaid);
//   },

//   async updateOrder(id, data) {
//     return await OrderModel.update(id, data);
//   },

//   async deleteOrder(id) {
//     return await OrderModel.delete(id);
//   },
// };

