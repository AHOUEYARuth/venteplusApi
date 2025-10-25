import { OrderModel } from "../models/order.model.js";

export const OrderService = {
  async createOrder(data) {
    return await OrderModel.create(data);
  },

  async getOrderById(id) {
    return await OrderModel.findById(id);
  },

  async getOrdersByShop(shopId,isPaid) {
    return await OrderModel.findByShop(shopId,isPaid);
  },

  async updateOrder(id, data) {
    return await OrderModel.update(id, data);
  },

  async deleteOrder(id) {
    return await OrderModel.delete(id);
  },
};
