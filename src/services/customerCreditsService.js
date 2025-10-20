import { CustomerCreditsModel } from "../models/customerCredits.model.js";


export const CustomerCreditsService = {
  async createCredit(data) {
    return CustomerCreditsModel.create(data);
  },

  async deleteCredit(id) {
    const credit = await CustomerCreditsModel.findById(id);
    if (!credit) throw new Error("Crédit client non trouvé");
    return CustomerCreditsModel.delete(id);
  },

  async listCreditsByShop({ shopId, customerId, name, startDate, endDate }) {
    if (!shopId) throw new Error("shopId est requis");
    return CustomerCreditsModel.findByShop({ shopId, customerId, name, startDate, endDate });
  }
};
