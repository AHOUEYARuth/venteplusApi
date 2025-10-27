import { CustomerModel } from "../models/customer.model.js";

 

export const CustomerService = {
  async createCustomer(data) {
    return CustomerModel.create(data);
  },

  async deleteCustomer(id) {
    const customer = await CustomerModel.findById(id);
    if (!customer) throw new Error("Client non trouvé");
    return CustomerModel.delete(id);
  },

  async listCustomers() {
    return CustomerModel.findAll();
  },

  async listCustomersByShop(shopId,filters = {}) {
    return CustomerModel.findByShop(shopId,filters);
  }
};
