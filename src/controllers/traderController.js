import { TraderService } from "../services/traderService.js";

export const TraderController = {
  async register(req, res) {
    try {
      const avatar = req.files?.["avatar"]?.[0];
      const logo = req.files?.["logo"]?.[0];
      const identityCard = req.files?.["identityCard"]?.[0];
      const imageShop = req.files?.["imageShop"]?.[0];
      console.log("avatar:");
      console.log(req.files);

      const data = {
        ...req.body,
        avatarUrl: avatar ? avatar.path : null,
        logoUrl: logo ? logo.path : null,
        identityCardUrl: identityCard ? identityCard.path : null,
        imageShopUrl: imageShop ? imageShop.path : null,
      };

      const result = await TraderService.registerTrader(data);

      return res.status(201).json({
        message: "Commerçant créé avec succès",
        data: result,
      });
    } catch (error) {
      console.error("Erreur dans TraderController.register:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la création du Commercant",
      });
    }
  },

  async registerEmploye(req, res) {
    try {
      const avatar = req.files?.["avatar"]?.[0];
      const identityCard = req.files?.["identityCard"]?.[0];
      const data = {
        ...req.body,
        avatarUrl: avatar ? avatar.path : null,
        identityCardUrl: identityCard ? identityCard.path : null,
      };

      const result = await TraderService.registerEmploye(data);

      return res.status(201).json({
        message: "Employé créé avec succès",
        data: result,
      });
    } catch (error) {
      console.error("Erreur dans TraderController.registerEmploye:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la création de l'employée",
      });
    }
  },

  async getTradersByShop(req, res) {
    try {
      const { shopId } = req.params;
       const filters = {
         name: req.query.name || null,
         dateFrom: req.query.dateFrom || null,
         dateTo: req.query.dateTo || null,
       }; 

      if (!shopId) {
        return res
          .status(400)
          .json({ message: "L'identifiant de la boutique est requis." });
      }

      const traders = await TraderService.getTradersByShop(shopId, filters);

      return res.status(200).json({
        message: "Liste des employées récupérée avec succès",
        data: traders,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error.message || "Erreur serveur lors de la récupération des traders",
      });
    }
  },

  async validateTrader(req, res) {
    try {
      const { traderId } = req.params;
      const { shopId } = req.body;

      const validatorId = req.user?.trader?.id;
      console.log("validator trader id", validatorId);
      if (!validatorId || !shopId) {
        return res
          .status(400)
          .json({ message: "Paramètres manquants (validatorId ou shopId)." });
      }

      const validated = await TraderService.validateTrader({
        validatorId,
        traderId,
        shopId,
      });

      return res.status(200).json({
        message: "Employé validé avec succès.",
        data: validated,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async blockedTrader(req, res) {
    try {
      const { traderId } = req.params;
      const { shopId } = req.body;

      const validatorId = req.user?.trader?.id;
      console.log("validator trader id", validatorId);
      if (!validatorId || !shopId) {
        return res
          .status(400)
          .json({ message: "Paramètres manquants (validatorId ou shopId)." });
      }

      const validated = await TraderService.blockedTrader({
        validatorId,
        traderId,
        shopId,
      });

      return res.status(200).json({
        message: "Employé bloqué avec succès.",
        data: validated,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
