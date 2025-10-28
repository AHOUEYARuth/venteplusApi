import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TraderModel } from '../models/trader.model.js';
import { UserModel } from '../models/user.model.js';
import { ShopModel } from '../models/shop.model.js';


const SALT_ROUNDS = 10;


function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:"30d"
    });
}


export async function login({
    phoneNumber,
    password,
    shopId
}) {

    console.log("Login attempt:", phoneNumber);
    if (!phoneNumber || !password) throw Object.assign(new Error('Phone number and password required'), {
        status: 400
    });



    const user = await UserModel.findByPhoneNumber(phoneNumber);
    const trader = user.trader;
    if (!user) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });
    if(!user.trader.isValidate) throw Object.assign(new Error('Compte non valide'), {
        status: 404
    });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });
 
    if (!shopId) {
        const shops = await ShopModel.findByTrader(trader.id);
        console.log("shops");
        console.log(trader.id);
         return {
           shops: shops.map((ts) => ts.shop),
         };
    } else {
         const token = signToken({
           id: user.id.toString(),
           phoneNumber: user.phoneNumber,
         });

         return {
           token,
           user,
         };
    }

   
};