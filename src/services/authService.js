import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import crypto from "crypto"
import jwt from 'jsonwebtoken';
import { TraderModel } from '../models/trader.model.js';
import { UserModel } from '../models/user.model.js';
import { ShopModel } from '../models/shop.model.js';


const SALT_ROUNDS = 10;
const OTP_TTL_MINUTES = 10; 
const OTP_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;


function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:"30d"
    });
}
function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
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
    if(!user.trader.isValidate) throw Object.assign(new Error("Compte non validé. Veuillez contacté l'administrateur de la boutique."), {
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


export async function  updateFcmToken(userId, token) {
    if (!userId || !token) throw new Error("Paramètres invalides");

    const user = await prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });

    return user;
};

 
export async function createOtpForPhone(phoneNumber) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otp.deleteMany({ where: { phoneNumber } });

  const otp = await prisma.otp.create({
    data: {
      phoneNumber,
      code,
      expiresAt,
      attempts: 0,
      used: false,
    },
  });
  return otp;
}

export async function getValidOtp(phoneNumber, code) {
  const record = await prisma.otp.findFirst({
    where: { phoneNumber, code, used: false },
  });
  if (!record) return null;
  if (record.expiresAt < new Date()) return null;
  return record;
}

export async function markOtpUsed(id) {
  return prisma.otp.update({ where: { id }, data: { used: true } });
}

export async function updatePasswordForPhone(phoneNumber, plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
  const user = await prisma.user.updateMany({
    where: { phoneNumber },
    data: { password: hashed },
  });
  return user.count > 0;
}

export async function findUserByPhone(phoneNumber) {
  return prisma.user.findUnique({ where: { phoneNumber } });
}


export async function incrementOtpAttempts(id) {
  return prisma.otp.update({
    where: { id },
    data: { attempts: { increment: 1 } },
  });
}

