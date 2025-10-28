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
      role: UserRole.TRADER,
    });

    const trader = await TraderModel.create({
      identityCard: identityCardUrl,
      userId: user.id,
      role,
      isValidate: true,
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

 
  async validateTrader({ validatorId, traderId, shopId }) {
    const validator = await prisma.trader.findUnique({
      where: { id: validatorId },
      include: { traderShops: true },
    });

    if (!validator) throw new Error("Le trader valideur n'existe pas.");
    if (validator.role !== "TRADER")
      throw new Error("Vous n'avez pas les droits pour valider un trader.");

    const traderToValidate = await prisma.trader.findUnique({
      where: { id: traderId },
      include: { traderShops: true },
    });

    if (!traderToValidate) throw new Error("Le trader à valider n'existe pas.");

    const validatorShopIds = validator.traderShops.map((ts) => ts.shopId);
    const traderShopIds = traderToValidate.traderShops.map((ts) => ts.shopId);

    const haveSameShop = validatorShopIds.some((id) =>
      traderShopIds.includes(id)
    );

    if (!haveSameShop) {
      throw new Error(
        "Ce trader n'appartient pas à la même boutique que vous."
      );
    }

    if (!validatorShopIds.includes(shopId)) {
      throw new Error(
        "Vous n'êtes pas autorisé à valider des traders pour cette boutique."
      );
    }

    const updatedTrader = await prisma.trader.update({
      where: { id: traderId },
      data: { isValidate: true },
    });

    return updatedTrader;
  },

  async blockedTrader({ validatorId, traderId, shopId }) {
    const validator = await prisma.trader.findUnique({
      where: { id: validatorId },
      include: { traderShops: true },
    });

    if (!validator) throw new Error("Le trader valideur n'existe pas.");
    if (validator.role !== "TRADER")
      throw new Error("Vous n'avez pas les droits pour valider un trader.");

    const traderToValidate = await prisma.trader.findUnique({
      where: { id: traderId },
      include: { traderShops: true },
    });

    if (!traderToValidate) throw new Error("Le trader à valider n'existe pas.");

    const validatorShopIds = validator.traderShops.map((ts) => ts.shopId);
    const traderShopIds = traderToValidate.traderShops.map((ts) => ts.shopId);

    const haveSameShop = validatorShopIds.some((id) =>
      traderShopIds.includes(id)
    );

    if (!haveSameShop) {
      throw new Error(
        "Ce trader n'appartient pas à la même boutique que vous."
      );
    }

    if (!validatorShopIds.includes(shopId)) {
      throw new Error(
        "Vous n'êtes pas autorisé à valider des traders pour cette boutique."
      );
    }

    const updatedTrader = await prisma.trader.update({
      where: { id: traderId },
      data: { isValidate: false },
    });

    return updatedTrader;
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
      role: UserRole.TRADER,
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

  async getTradersByShop(shopId,filters = {}) {
    
    try {
       const { name, dateFrom, dateTo } = filters;

     

      const traders = await prisma.trader.findMany({
        where: {
          traderShops: {
            some: { shopId: shopId },
          },
          ...(name && {
            user: {
              OR: [
                { name: { contains: name, mode: "insensitive" } },
                { firstName: { contains: name, mode: "insensitive" } },
              ],
            },
          }),
          ...(dateFrom || dateTo
            ? {
                createdAt: {
                  ...(dateFrom && {
                    gte: new Date(dateFrom.split("-").reverse().join("-")),
                  }),
                  ...(dateTo && {
                    lte: new Date(dateTo.split("-").reverse().join("-")),
                  }),
                },
              }
          : {}),
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
