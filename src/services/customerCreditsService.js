import { CustomerCreditsModel } from "../models/customerCredits.model.js";

export const CustomerCreditsService = {
  async createCustomerCredit(data) {
    return await CustomerCreditsModel.create(data);
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
