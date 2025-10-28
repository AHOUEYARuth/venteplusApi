import bcrypt from "bcrypt";
import { TraderModel } from "../models/trader.model.js";
import { ShopModel } from "../models/shop.model.js";
import { UserModel } from "../models/user.model.js";
import { UserRole } from "@prisma/client";
import prisma from "../prismaClient.js";

export const TraderService = {
  async registerTrader(data) {
    const {
      name,
      firstName,
      email,
      phoneNumber,
      password,
      role,
      identityCardUrl,
      shopName,
      shopDescription,
      interventionArea,
      shopAddress,
      avatarUrl,
      logoUrl,
      imageShopUrl,
    } = data;
 
    const existingUser = await UserModel.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new Error("Numéro de téléphone déjà utilisé");
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const user = await UserModel.create({
      name,
      firstName,
      email,
      phoneNumber,
      password: hashedPassword,
      avatarUrl,  
      role:UserRole.TRADER
    });

 
    const trader = await TraderModel.create({
      identityCard: identityCardUrl,
      userId: user.id,
      role,
    });

     
    const shop = await ShopModel.create({
      name: shopName,
      address: shopAddress,
      description: shopDescription,
      interventionArea,
      logo: logoUrl,        
      image: imageShopUrl, 
      
    });
    await prisma.traderShop.create({
      data: {
        traderId: trader.id,
        shopId: shop.id,
      },
    });

    return { user, trader, shop };
  },


  async getTradersByShop(shopId) {
    try {
      const traders = await prisma.trader.findMany({
        where: {
          traderShops: {
            some: { shopId: shopId },
          },
        },
        include: {
          user: true,  
          traderShops: {
            include: { shop: true },
          },
        },
      });

      return traders;
    } catch (error) {
      console.error("Erreur lors de la récupération des traders :", error);
      throw new Error("Impossible de récupérer les traders de cette boutique");
    }
  },

  async registerEmploye(data) {
    const {
      name,
      firstName,
      email,
      phoneNumber,
      password,
      role,
      identityCardUrl,
      avatarUrl,
      shopId,
    } = data;
 
    const existingUser = await UserModel.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new Error("Numéro de téléphone déjà utilisé");
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const user = await UserModel.create({
      name,
      firstName,
      email,
      phoneNumber,
      password: hashedPassword,
      avatarUrl,  
      role:UserRole.TRADER
    });

 
    const trader = await TraderModel.create({
      identityCard: identityCardUrl,
      userId: user.id,
      role,
    });

  
    await prisma.traderShop.create({
      data: {
        traderId: trader.id,
        shopId: shopId,
      },
    });

    return { user, trader };
  },

  async getTradersByShop(shopId) {
    try {
      const traders = await prisma.trader.findMany({
        where: {
          traderShops: {
            some: { shopId: shopId },
          },
        },
        include: {
          user: true,  
          traderShops: {
            include: { shop: true },
          },
        },
      });

      return traders;
    } catch (error) {
      console.error("Erreur lors de la récupération des employée :", error);
      throw new Error("Impossible de récupérer les traders de cette boutique");
    }
  },
};
