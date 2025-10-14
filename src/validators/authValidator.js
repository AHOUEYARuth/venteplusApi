import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Votre email est invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Votre mot de passe doit contenir au moins 6 caractères'),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
];

export const loginValidation = [
  body('password')
    .notEmpty()
    .withMessage('Votre mot de passe est requis'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Votre numéro de téléphone est requis'),
];