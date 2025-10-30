import cron from "node-cron";
import admin from "../firebase.js";
import prisma from "../src/prismaClient.js";


 
cron.schedule("0 19 * * *", async () => {
  console.log("Envoi automatique de notification à 19h00...");

  try {
  
    const users = await prisma.user.findMany({
      where: { fcmToken: { not: null } },
      select: { fcmToken: true },
    });

    const tokens = users.map((u) => u.fcmToken).filter(Boolean);
    if (tokens.length === 0) {
      console.log("Aucun utilisateur avec un token FCM trouvé.");
      return;
    }
 
    const message = {
      notification: {
        title: "Rappel du jour",
        body: "N’oubliez pas de vérifier vos ventes du jour !",
      },
      tokens,
    };

    
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Notifications envoyées : ${response.successCount}/${tokens.length}`);
  } catch (error) {
    console.error("Erreur lors de l’envoi de la notification :", error.message);
  }
});
