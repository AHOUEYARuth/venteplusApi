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
            const { token, trader } = await authService.login(req.body);

            res.json({
              success: true,
              data: {
                token,
                user: {
                  ...trader,
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