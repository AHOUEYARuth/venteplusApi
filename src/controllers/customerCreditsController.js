import { CustomerCreditsService } from "../services/customerCreditsService.js";

 
 

export const CustomerCreditsController = {
  async create(req, res) {
    try {
      const credit = await CustomerCreditsService.createCredit(req.body);
      return res.status(201).json({ message: "Crédit client créé ✅", data: credit });
    } catch (error) {
      console.error("Erreur création crédit :", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await CustomerCreditsService.deleteCredit(id);
      return res.status(200).json({ message: "Crédit client supprimé 🗑️" });
    } catch (error) {
      console.error("Erreur suppression crédit :", error);
      return res.status(400).json({ message: error.message });
    }
  },

   async listByShop(req, res) {
    try {
      const { shopId } = req.params; // shopId passé en param
      const { customerId, name, startDate, endDate } = req.query;

      const credits = await CustomerCreditsService.listCreditsByShop({  
        shopId,
        customerId,
        name,
        startDate,
        endDate
      });

      return res.status(200).json({ message: "Liste des crédits ✅", data: credits });
    } catch (error) {
      console.error("Erreur listage crédits :", error);
      return res.status(400).json({ message: error.message });
    }
  }
};
