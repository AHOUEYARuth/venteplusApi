import { CustomerService } from "../services/customerService.js";

export const CustomerController = {
  async createCustomer(req, res) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      return res.status(201).json({ message: "Client créé ✅", data: customer });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      await CustomerService.deleteCustomer(id);
      return res.status(200).json({ message: "Client supprimé 🗑️" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async listCustomers(req, res) {
    try {
      const { shopId } = req.query;
      let customers;
      if (shopId) {
        customers = await CustomerService.listCustomersByShop(shopId);
      } else {
        customers = await CustomerService.listCustomers();
      }
      return res.status(200).json({ message: "Liste des clients ✅", data: customers });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};
