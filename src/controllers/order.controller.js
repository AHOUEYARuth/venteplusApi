import { OrderService } from "../services/order.service.js";

export const OrderController = {
  async create(req, res) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async getByShop(req, res) {
    try {
      const { isPaid } = req.query;
      const orders = await OrderService.getOrdersByShop(req.params.shopId,isPaid);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await OrderService.updateOrder(req.params.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await OrderService.deleteOrder(req.params.id);
      res.status(200).json({ success: true, message: "Commande supprimée ✅" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
