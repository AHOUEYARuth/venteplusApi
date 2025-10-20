import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TraderModel } from '../models/trader.model.js';


const SALT_ROUNDS = 10;


function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
}



export async function login({
    phoneNumber,
    password
}) {
    console.log("Login attempt:", phoneNumber);
    if (!phoneNumber || !password) throw Object.assign(new Error('Phone number and password required'), {
        status: 400
    });

    const trader = await TraderModel.findByPhoneNumber(phoneNumber);
    if (!trader) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });

    const valid = await bcrypt.compare(password, trader.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });

    const token = signToken({
        sub: trader.id,
        phoneNumber: trader.phoneNumber
    });
    return {
        token,
        trader: {
            id: trader.id,
            email: trader.email,
            name: trader.name,
            avatarUrl: trader.avatarUrl,
            phoneNumber: trader.phoneNumber
        },
    };
};