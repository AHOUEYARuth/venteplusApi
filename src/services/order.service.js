
import { OrderStatus } from "@prisma/client";
import { OrderModel } from "../models/order.model.js";
import { ToOrderModel } from "../models/toOrder.model.js";
import prisma from "../prismaClient.js";
import admin from "../../firebase.js";

export const OrderService = {
async createOrder(data) {
    const {
      customerId,
      shopId,
      deliveryAddress,
      isSale,
      productId,
      quantity,
    } = data;

    return await prisma.$transaction(async (tx) => {
     
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produit introuvable");
    
      const totalAmount = product.salePrice * quantity;
      if(isSale === true && product.availableQuantity < quantity) throw new Error("Produit non disponible. Augmenté votre stock");
      const order = await tx.order.create({
        data: {
          totalAmount,
          deliveryAddress,
          status: isSale === true ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
          customerId,
          shopId,
          isSale,
        },
      });
      if(isSale){
        await tx.product.update({
          where: { id: productId },
          data: { availableQuantity: product.availableQuantity - quantity },
        });
      }
      
 
      await tx.toOrder.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
        },
      });
 
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          shop: true,
          toOrders: { include: { product: true } },
        },
      });
    });
  },


  async getStatistics(shopId) {
    if (!shopId) throw new Error("shopId est requis");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
 
    const monthlySalesCount = await prisma.order.count({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

  
    const pendingOrders = await prisma.order.count({
      where: {
        shopId,
        status: "PENDING",
      },
    });
 
    const monthlyOrders = await prisma.order.findMany({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      include: {
        toOrders: { include: { product: true } },
      },
    });

    let monthlyProfit = 0;
    for (const order of monthlyOrders) {
      for (const item of order.toOrders) {
        const profitPerProduct =
          (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        monthlyProfit += profitPerProduct;
      }
    }

 
    const year = now.getFullYear();
    const yearlyProfit = [];

    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);

      const orders = await prisma.order.findMany({
        where: {
          shopId,
          isSale: true,
          createdAt: { gte: start, lte: end },
        },
        include: {
          toOrders: { include: { product: true } },
        },
      });

      let profit = 0;
      for (const order of orders) {
        for (const item of order.toOrders) {
          const profitPerProduct =
            (item.product.salePrice - item.product.purchasePrice) * item.quantity;
          profit += profitPerProduct;
        }
      }

      yearlyProfit.push({
        month: start.toLocaleString("fr-FR", { month: "short" }),
        profit,
      });
    }

    return {
      monthlySalesCount,
      pendingOrders,
      monthlyProfit,
      yearlyProfit,
    };
  },



  async getDaysStatistics(shopId) {
    if (!shopId) throw new Error("shopId est requis");

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

 
    const daysSalesCount = await prisma.order.count({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    
    const pendingOrders = await prisma.order.count({
      where: {
        shopId,
        status: "PENDING",
      },
    });

  
    const daysOrders = await prisma.order.findMany({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        toOrders: { include: { product: true } },
      },
    });

    let daysProfit = 0;
    for (const order of daysOrders) {
      for (const item of order.toOrders) {
        const profitPerProduct =
          (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        daysProfit += profitPerProduct;
      }
    }
 

    return {
      daysSalesCount,
      pendingOrders,
      daysProfit,

    };
  },

  
  async deliveredOrder(id) {
    return await OrderModel.update(id, { status : OrderStatus.DELIVERED });
  }, 
  async confirmeOrder(id) {
    return await OrderModel.update(id, { status : OrderStatus.CONFIRMED });
  }, 

  async cancelOrder(orderId) {
    return await OrderModel.cancelOrder(orderId);
  },
  async computeStatistics(shopId, isSale) {
  if (!shopId) throw new Error("shopId est requis");

  // ⚙️ Cas 1 : Commandes classiques
  if (typeof isSale === "undefined" || isSale === null || isSale === false) {
    const [totalOrders, cancelledOrders, deliveredOrders] = await Promise.all([
      prisma.order.count({ where: { shopId } }),
      prisma.order.count({ where: { shopId, status: "CANCELLED" } }),
      prisma.order.count({ where: { shopId, status: "DELIVERED" } }),
    ]);

    return {
      totalOrders,
      cancelledOrders,
      deliveredOrders,
    };
  }

  // ⚙️ Cas 2 : Ventes
  if (isSale === true) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total ventes du mois
    const monthlySalesAgg = await prisma.order.aggregate({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { totalAmount: true },
    });

    const monthlySales = monthlySalesAgg._sum.totalAmount ?? 0;

    // Calcul du bénéfice net et total via les produits liés
    const orders = await prisma.order.findMany({
      where: { shopId, isSale: true },
      include: {
        toOrders: { include: { product: true } },
      },
    });

    let netProfit = 0;
    let totalProfit = 0;

    for (const order of orders) {
      for (const item of order.toOrders) {
        const profitPerProduct = (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        totalProfit += profitPerProduct; 
        if (order.createdAt >= startOfMonth && order.createdAt <= endOfMonth) {
          netProfit += profitPerProduct;
        }
      }
    }

    return {
      monthlySales,
      netProfit,
      totalProfit,
    };
  }

  return {};
},
 


async payOrder(orderId) {
 
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      toOrders: { include: { product: true } },
      customerCredit: true,
    },
  });

  if (!order) {
    throw Object.assign(new Error("Commande introuvable"), { status: 404 });
  }

 
  if (order.isSale) {
    throw Object.assign(new Error("Commande déjà payée"), { status: 400 });
  }
 
  const result = await prisma.$transaction(async (tx) => {
 
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        isSale: true,
        status: order.status == OrderStatus.PENDING ? OrderStatus.CONFIRMED : order.status
      },
    });
 
    if (order.customerCredit) {
      await tx.customerCredit.update({
        where: { id: order.customerCredit.id },
        data: { isPaid: true, totalAmountToPay: order.totalAmount, amountPaid: order.totalAmount  },
      });
    }
 
    for (const item of order.toOrders) {
      const newQty = item.product.availableQuantity - item.quantity;

      if (newQty < 0) {
        throw Object.assign(
          new Error(`Stock insuffisant pour ${item.product.label}`),
          { status: 400 }
        );
      }
      if(newQty <= item.product.minimumQuantity){
          const message = {
              notification: {
                title: "Rappel produit",
                body: `Augmentez votre stock de produit de ${item.product.name}`,
              },
              tokens,
          };
        
            
         await admin.messaging().sendEachForMulticast(message);
      }

      await tx.product.update({
        where: { id: item.product.id },
        data: { availableQuantity: newQty },
      });
    }

    return updatedOrder;
  });

  return result;
},



 async getMonthlySales(shopId) {
    if (!shopId) throw new Error("shopId est requis");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const sales = await prisma.order.findMany({
      where: {
        shopId,
        isSale: true,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      include: {
        toOrders: { include: { product: true } },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // calcule profit sur chaque vente
    const result = sales.map((order) => {
      let profit = 0;
      order.toOrders.forEach((item) => {
        profit +=
          (item.product.salePrice - item.product.purchasePrice) * item.quantity;
      });
      return {
        ...order,
        profit,
        date: order.createdAt,
      };
    });

    return result;
  },
  async getAllOrders(shopId,filters) {
    return await OrderModel.findAll(shopId,filters);
  },

  async getOrderById(id) {
    return await OrderModel.findById(id);
  },

  async updateOrder(id, data) {
    return await OrderModel.update(id, data);
  },

  async deleteOrder(id) {
    return await OrderModel.delete(id);
  },
};

