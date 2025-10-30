import cron from "node-cron";
import admin from "../firebase.js";
import prisma from "../src/prismaClient.js";
 

async function sendNotification({ token, title, body }) {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
    });
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi de la notification :", error.message);
  }
}
 
cron.schedule("0 */8 * * *", async () => {
  console.log("🔔 Vérification des stocks faibles...");

  try {
 
    const products = await prisma.product.findMany({
      include: {
        shop: {
          include: {
            traderShops: {
              include: {
                trader: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    
    const lowStockProducts = products.filter(
      (p) => p.availableQuantity < p.minimumQuantity
    );
    console.log("Tache cron")
    if (lowStockProducts.length === 0) {
      console.log("✅ Aucun produit en rupture imminente.");
      return;
    }

    
    const shopProductsMap = {};
    for (const product of lowStockProducts) {
      if (!shopProductsMap[product.shopId]) {
        shopProductsMap[product.shopId] = [];
      }
      shopProductsMap[product.shopId].push(product);
    }

 
    for (const [shopId, products] of Object.entries(shopProductsMap)) {
      const shop = products[0].shop;
      const traderShop = shop.traderShops[0];
      const trader = traderShop?.trader;
      const user = trader?.user;

      if (!user?.fcmToken) continue;

      const productNames = products.map((p) => p.name).join(", ");

      const title = "🚨 Alerte de stock faible";
      const body = `Les produits suivants sont presque en rupture : ${productNames}.`;

      await sendNotification({ token: user.fcmToken, title, body });
      console.log(`📩 Notification envoyée à ${user.name}: ${body}`);
    }

    console.log("✅ Tâche terminée avec succès.");
  } catch (error) {
    console.error("❌ Erreur lors de la vérification des stocks faibles :", error);
  }
});
