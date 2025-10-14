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
        const {
            token,
            seller
        } = await authService.login(req.body);
        res.json({
            success: true,
            data: {
                token,
                seller: {
                    id: seller.id,
                    email: seller.email,
                    avatarUrl: seller.avatarUrl,
                    name: seller.name,
                    phoneNumber: seller.phoneNumber
                }
            }
        });
    } catch (err) {
        next(err);
    }
};