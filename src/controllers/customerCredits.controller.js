import { CustomerCreditsService } from "../services/customerCreditsService.js";

export const CustomerCreditsController = {
  async create(req, res) {
    try {
      const data = req.body;
      const credit = await CustomerCreditsService.createCustomerCredit(data);
      res.status(201).json(credit);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création du crédit", error });
    }
  },

  async getAll(req, res) {
    try {
      const { shopId } = req.params;
      const filters = {
        name: req.query.name || null,
        dateFrom: req.query.dateFrom || null,
        dateTo: req.query.dateTo || null,
      };

      const credits = await CustomerCreditsService.getAllCustomerCredits(shopId,filters);
      res.json({ success: true, data: credits });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des crédits", error });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const credit = await CustomerCreditsService.getCustomerCreditById(id);
      if (!credit) return res.status(404).json({ message: "Crédit non trouvé" });
      res.json(credit);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du crédit", error });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const credit = await CustomerCreditsService.updateCustomerCredit(id, data);
      res.json(credit);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du crédit", error });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await CustomerCreditsService.deleteCustomerCredit(id);
      res.json({ message: "Crédit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du crédit", error });
    }
  },
};
