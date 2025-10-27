
import { OrderService } from "../services/order.service.js";
import {CustomerCreditsService} from "../services/customerCreditsService.js";
export const OrderController = {
  async create(req, res) {
    try {
      const { isCredit, ...orderData } = req.body;
      const order = await OrderService.createOrder(orderData);

      if (isCredit) {
        const creditData = {
          totalAmountToPay: order.totalAmount,
          customerId: order.customerId,
          orderId: order.id,
          shopId: order.shopId,
        };
        await CustomerCreditsService.createCustomerCredit(creditData);
      }

      res.status(201).json({
        message: "Commande créée avec succès",
        order,
        creditCreated: isCredit || false,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la création de la commande",
      });
    }
  },

  async getByShop(req, res) {
    try {
      const shopId = req.params.shopId;
      const filters = {
        customerId: req.query.customerId || null,
        status: req.query.status || null,
        dateFrom: req.query.dateFrom || null,
        dateTo: req.query.dateTo || null,
        isSale: req.query.isSale === "true" ? true : req.query.isSale === "false" ? false : undefined,
      };
      const statistics = await OrderService.computeStatistics(shopId, filters.isSale);
      const orders = await OrderService.getAllOrders(shopId,filters);
      res.json({ success: true, data: orders,statistics });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des commandes",
        error: error.message,
      });
    }
  },
  async getMonthlySales(req, res) {
    try {
      const { shopId } = req.params;
      const data = await OrderService.getMonthlySales(shopId);
      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des ventes du mois",
        error: error.message,
      });
    }
  },
   async getStatistics(req, res) {
    try {
      const { shopId } = req.params;
      const data = await OrderService.getStatistics(shopId);
      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Erreur lors du calcul des statistiques",
        error: error.message,
      });
    }
  },
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      if (!order)
        return res.status(404).json({ success: false, message: "Commande introuvable" });

      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de la commande",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.updateOrder(id, req.body);
      res.json({ success: true, message: "Commande mise à jour ✅", data: order });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Erreur lors de la mise à jour de la commande",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id);
      res.json({ success: true, message: "Commande supprimée avec succès ✅" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de la commande",
        error: error.message,
      });
    }
  },
};


// import { OrderService } from "../services/order.service.js";

// export const OrderController = {
//   async create(req, res) {
//     try {
//       const order = await OrderService.createOrder(req.body);
//       res.status(201).json({ success: true, data: order });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   },

//   async getById(req, res) {
//     try {
//       const order = await OrderService.getOrderById(req.params.id);
//       res.status(200).json({ success: true, data: order });
//     } catch (error) {
//       res.status(404).json({ success: false, message: error.message });
//     }
//   },

//   async getByShop(req, res) {
//     try {
//       const { isPaid } = req.query;
//       const orders = await OrderService.getOrdersByShop(req.params.shopId,isPaid);
//       res.status(200).json({ success: true, data: orders });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   },

//   async update(req, res) {
//     try {
//       const updated = await OrderService.updateOrder(req.params.id, req.body);
//       res.status(200).json({ success: true, data: updated });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   },

//   async delete(req, res) {
//     try {
//       await OrderService.deleteOrder(req.params.id);
//       res.status(200).json({ success: true, message: "Commande supprimée ✅" });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   },
// };
