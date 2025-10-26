import { CustomerCreditsModel } from "../models/customerCredits.model.js";
import prisma from "../prismaClient.js";

export const CustomerCreditsService = {
 
  async createCustomerCredit(data) {
    return prisma.customerCredits.create({
      data: {
        totalAmountToPay: data.totalAmountToPay,
        isPaid: false,
        amountPaid: 0,
        customerId: data.customerId,
        orderId: data.orderId,
        shopId: data.shopId,
      },
    });
  },
  async getAllCustomerCredits(shopId,filters) {
    return await CustomerCreditsModel.findAll(shopId,filters);
  },

  async getCustomerCreditById(id) {
    return await CustomerCreditsModel.findById(id);
  },

  async updateCustomerCredit(id, data) {
    return await CustomerCreditsModel.update(id, data);
  },

  async deleteCustomerCredit(id) {
    return await CustomerCreditsModel.delete(id);
  },
};
