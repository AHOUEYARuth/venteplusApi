import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 10;


function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
}


export async function register({
    email,
    phoneNumber,
    password,
    name,
    avatarPath
}){
    if (!password || !phoneNumber) throw Object.assign(new Error('Email, phone number, and password required'), {
        status: 400
    });

    const existing = await prisma.sellers.findUnique({
        where: {
            phoneNumber
        }
    });
    if (existing) throw Object.assign(new Error('Phone number already in use'), {
        status: 409
    });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const seller = await prisma.sellers.create({
        data: {
            email,
            password: hash,
            phoneNumber,
            name,
            avatarUrl: avatarPath
        },
    });

    return {
        id: seller.id,
        email: seller.email,
        name: seller.name,
        avatarUrl: seller.avatarUrl,
        phoneNumber: seller.phoneNumber
    };
};


export async function login({
    phoneNumber,
    password
}) {
    console.log("Login attempt:", phoneNumber);
    if (!phoneNumber || !password) throw Object.assign(new Error('Phone number and password required'), {
        status: 400
    });

    const seller = await prisma.sellers.findUnique({
        where: {
            phoneNumber
        }
    });
    if (!seller) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });

    const valid = await bcrypt.compare(password, seller.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), {
        status: 401
    });

    const token = signToken({
        sub: seller.id,
        phoneNumber: seller.phoneNumber
    });
    return {
        token,
        seller: {
            id: seller.id,
            email: seller.email,
            name: seller.name,
            avatarUrl: seller.avatarUrl,
            phoneNumber: seller.phoneNumber
        },
    };
};