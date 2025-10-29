import express from "express";
import prisma from "../prismaClient.js";
import admin from "../../firebase.js";
 

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { fcmToken: { not: null } },
      select: { fcmToken: true },
    });

    const tokens = users.map((u) => u.fcmToken).filter(Boolean);

    const message = {
      notification: {
        title: req.body.title || "Test FCM 🚀",
        body: req.body.body || "Ceci est une notification de test.",
      },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    res.json({
      success: true,
      message: `${response.successCount} notifications envoyées.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
