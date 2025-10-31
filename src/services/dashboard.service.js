import prisma from "../prismaClient.js";
import moment from "moment"


export const getDashboardStats = async (shopId) => {
  const now = new Date();
  const startOfDay = moment().startOf("day").toDate();
  const startOfMonth = moment().startOf("month").toDate();
  const startOfLastMonth = moment().subtract(1, "month").startOf("month").toDate();
  const endOfLastMonth = moment().subtract(1, "month").endOf("month").toDate();

  const startOfMonthSales = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonthSales = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  
 
  const orders = await prisma.order.findMany({
      where: { 
        shopId,
        isSale: true,
        orderDate: { gte: startOfMonth }
      },
      include: {
        toOrders: { include: { product: true } },
      },
  });


  let monthNetProfit = 0;
  let monthTotalProfit = 0;

    for (const order of orders) {
      for (const item of order.toOrders) {
        const profitPerProduct = (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        monthTotalProfit += profitPerProduct; 
        if (order.createdAt >= startOfMonthSales && order.createdAt <= endOfMonthSales) {
          monthNetProfit += profitPerProduct;
        }
      }
  }
 
  const totalSales = await prisma.order.aggregate({
    where: { shopId, isSale: true },
    _sum: { totalAmount: true },
  });

  const totalsDettesMonth = await prisma.expenses.aggregate({
    where: {
      shopId,
      createdAt:{ gte: startOfMonth }
    },
    _sum: { spendAmount: true }
  })

  const todaySales = await prisma.order.aggregate({
    where: {
      shopId,
      isSale: true,
      orderDate: { gte: startOfDay },
    },
    _sum: { totalAmount: true },
  });

  const monthlySales = await prisma.order.aggregate({
    where: {
      shopId,
      isSale: true,
      orderDate: { gte: startOfMonth },
    },
    _sum: { totalAmount: true },
  });

  const lastMonthSales = await prisma.order.aggregate({
    where: {
      shopId,
      isSale: true,
      orderDate: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
    _sum: { totalAmount: true },
  });

  const salesGrowth =
    lastMonthSales._sum.totalAmount
      ? ((monthlySales._sum.totalAmount - lastMonthSales._sum.totalAmount) /
          lastMonthSales._sum.totalAmount) *
        100
      : 0;

  
  const totalOrders = await prisma.order.count({ where: { shopId } });
  const pendingOrders = await prisma.order.count({
    where: { shopId, isSale: false },
  });

  
  const lowStockProducts = await prisma.product.count({
    where: { shopId, availableQuantity: { lt: 5 } },
  });

 const topSellingRaw = await prisma.toOrder.groupBy({
  by: ["productId"],
  where: { order: { shopId } },
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: "desc" } },
  take: 5,
});

const topSellingProducts = await Promise.all(
  topSellingRaw.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        salePrice: true,
        purchasePrice: true,
        availableQuantity: true,
        category: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
 
    const totalProfit =
      ((product?.salePrice || 0) - (product?.purchasePrice || 0)) *
      (item._sum.quantity || 0);

    return {
      product,
      totalSold: item._sum.quantity || 0,
      totalProfit,
    };
  })
);

 
  const customersCount = await prisma.customers.count({ where: { shopId } });

 const totalCredits = await prisma.customerCredits.findMany({
  where: { shopId, isPaid: false },
  select: { totalAmountToPay: true, amountPaid: true },
});

const totalUnpaidCredits = totalCredits.reduce(
  (sum, credit) => sum + (credit.totalAmountToPay - credit.amountPaid),
  0
);

  const paidCredits = await prisma.customerCredits.aggregate({
    where: { shopId, isPaid: true },
    _sum: { totalAmountToPay: true },
  });

  const totalOrdersWithCredit = await prisma.customerCredits.count({
    where: { shopId },
  });

  const creditRate =
    totalOrders > 0 ? (totalOrdersWithCredit / totalOrders) * 100 : 0;
 
  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    moment().subtract(i, "days").startOf("day")
  );

  const dailySales = await Promise.all(
    last7Days.map(async (date) => {
      const total = await prisma.order.aggregate({
        where: {
          shopId,
          isSale: true,
          orderDate: {
            gte: date.toDate(),
            lt: moment(date).endOf("day").toDate(),
          },
        },
        _sum: { totalAmount: true },
      });

      return {
        date: date.format("DD/MM"),
        total: total._sum.totalAmount || 0,
      };
    })
  );

  const salesLast7Days = dailySales.reverse(); 
  
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 12 }).map(async (_, i) => {
      const start = moment().month(i).startOf("month").toDate();
      const end = moment().month(i).endOf("month").toDate();

      const total = await prisma.order.aggregate({
        where: {
          shopId,
          isSale: true,
          orderDate: { gte: start, lte: end },
        },
        _sum: { totalAmount: true },
      });

      return {
        month: moment().month(i).format("MMM"),
        total: total._sum.totalAmount || 0,
      };
    })
  );

  return {
    expenses:{
      monthNetProfit,
      monthTotalProfit,
      spentingMonth:monthNetProfit - (totalsDettesMonth._sum.spendAmount ?? 0),
      totalMonthExpenses:totalsDettesMonth._sum.spendAmount || 0
    },
    sales: {
      total: totalSales._sum.totalAmount || 0,
      today: todaySales._sum.totalAmount || 0,
      month: monthlySales._sum.totalAmount || 0,
      growth: salesGrowth.toFixed(2),
      monthNetProfit,
      monthTotalProfit,
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
    },
    products: {
      lowStock: lowStockProducts,
      topSelling: topSellingProducts,
    },
    customers: {
      total: customersCount,
      totalCredits: totalUnpaidCredits,
      paidCredits: paidCredits._sum.totalAmountToPay || 0,
      creditRate: creditRate.toFixed(2),
    },
    charts: {
      salesLast7Days,
      monthlyRevenue,
    },
  };
};