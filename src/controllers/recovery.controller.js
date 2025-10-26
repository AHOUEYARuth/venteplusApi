import { RecoveryService } from "../services/recovery.service.js";

export const RecoveryController = {
  // 🟢 Créer
  async create(req, res) {
    try {
      const recovery = await RecoveryService.createRecovery(req.body);
      res.status(201).json({ success: true, data: recovery });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la création de la récupération" });
    }
  },

  // 🟡 Lire toutes les récupérations d’un CustomerCredit
  async findAllByCustomerCredit(req, res) {
    try {
      const { customerCreditId } = req.params;
      const recoveries = await RecoveryService.getRecoveriesByCustomerCredit(customerCreditId);

      res.json({ success: true, data: recoveries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la récupération des paiements" });
    }
  },

  // 🔵 Lire par ID
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const recovery = await RecoveryService.getRecoveryById(id);

      if (!recovery) {
        return res.status(404).json({ success: false, message: "Récupération introuvable" });
      }

      res.json({ success: true, data: recovery });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la récupération" });
    }
  },

  // 🟠 Mise à jour
  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await RecoveryService.updateRecovery(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la mise à jour" });
    }
  },

  // 🔴 Suppression
  async delete(req, res) {
    try {
      const { id } = req.params;
      await RecoveryService.deleteRecovery(id);
      res.json({ success: true, message: "Récupération supprimée avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la suppression" });
    }
  },
};
