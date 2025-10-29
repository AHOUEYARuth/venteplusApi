import * as authService from '../services/authService.js';
import { sendMessage } from '../services/whatsapp.service.js';

export async function requestOtp(req, res) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone is required" });

    const user = await authService.findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        message:
          "Ce numéro n'est pas utiliser pour un compte.",
      });
    }

    const otp = await authService.createOtpForPhone(phoneNumber);

    const text = `Votre code de vérification est: ${otp.code}. Il expire dans ${10} minutes.`;
    
    try {
      await sendMessage(phoneNumber, text);
    } catch (err) {
      console.error("WhatsApp send failed:", err);
      
    }

    return res.status(200).json({
      message:
        "OTP envoyé (si le numéro est enregistré). Vérifiez WhatsApp. Le code est valable 10 minutes.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
 
export async function verifyOtp(req, res) {
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code)
      return res.status(400).json({ message: "phone and code are required" });

    const otp = await authService.getValidOtp(phoneNumber, code);
    if (!otp) return res.status(400).json({ message: "Code invalide ou expiré" });
 
    await authService.markOtpUsed(otp.id);
 
    return res.status(200).json({ message: "OTP validé. Vous pouvez réinitialiser le mot de passe." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
 
export async function resetPassword(req, res) {
  try {
    const { phoneNumber, code, newPassword, confirmPassword } = req.body;
    if (!phoneNumber || !code || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });

    const otp = await authService.getValidOtp(phoneNumber, code);
    if (!otp) return res.status(400).json({ message: "Code invalide ou expiré" });
 
    if (otp.attempts >= 5) {
      return res
        .status(429)
        .json({ message: "Trop de tentatives. Demandez un nouveau code." });
    }

 
    const ok = await authService.updatePasswordForPhone(phoneNumber, newPassword);
    if (!ok) {
      return res.status(500).json({ message: "Impossible de mettre à jour le mot de passe" });
    }
 
    await authService.markOtpUsed(otp.id);

    return res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}