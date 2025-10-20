import bcrypt from "bcrypt";
import { TraderModel } from "../models/trader.model.js";
import { ShopModel } from "../models/shop.model.js";
import { UserModel } from "../models/user.model.js";

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
      role,
    });

 
    const trader = await TraderModel.create({
      identityCard: identityCardUrl,  
      userId: user.id,
    });

     
    const shop = await ShopModel.create({
      name: shopName,
      address: shopAddress,
      description: shopDescription,
      logo: logoUrl,        
      image: imageShopUrl, 
      traderId: trader.id,
    });

    return { user, trader, shop };
  },
};
