import { ShopModel } from '../models/shop.model.js';
import * as authService from '../services/authService.js';

export async function register(req, res, next) {
    try {
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

    const seller = await authService.register({
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      name: req.body.name,
      avatarPath,
    });

    res.status(201).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
};

 

export async function login(req, res, next) {
    try {
        
        if (req.body.shopId) {
            const { token, user } = await authService.login(req.body);
            const shop = await ShopModel.findById(req.body.shopId);
            res.json({
              success: true,
              data: {
                token,
                shop,
                user: {
                  ...user,
                },
              },
            });

        } else {
            const { shops } = await authService.login(req.body);
            console.log(shops);
            

            res.json({
              success: true,
              data: {
                  shops: shops
              },
            });

        }
        
    } catch (err) {
        next(err);
    }
};

export async function updateFcmToken(req, res) {
  try {
    const userId = req.user.id;
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ success: false, message: "Le token FCM est requis" });
    }

    const user = await authService.updateFcmToken(userId, fcmToken);

    res.json({
      success: true,
      message: "Token FCM mis à jour avec succès",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du token FCM",
      error: error.message,
    });
  }
}