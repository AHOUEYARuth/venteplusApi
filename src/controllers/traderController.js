import { TraderService } from "../services/traderService.js";

export const TraderController = {
  async register(req, res) {
    try {
      
      const avatar = req.files?.["avatar"]?.[0];
      const logo = req.files?.["logo"]?.[0];
      const identityCard = req.files?.["identityCard"]?.[0];
      const imageShop = req.files?.["imageShop"]?.[0];
      console.log("avatar:");
      console.log(req.files)
      
      const data = {
        ...req.body,
        avatarUrl: avatar ? avatar.path : null,
        logoUrl: logo ? logo.path : null,
        identityCardUrl: identityCard ? identityCard.path : null,
        imageShopUrl: imageShop ? imageShop.path : null,
      };

     
      const result = await TraderService.registerTrader(data);
 
      return res.status(201).json({
        message: "Commerçant créé avec succès ✅",
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
        message: "Employé créé avec succès ✅",
        data: result,
      });
    } catch (error) {
      console.error("Erreur dans TraderController.registerEmploye:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de la création de l'employée",
      });
    }
  },
};
