import { getDashboardStats } from "../services/dashboard.service.js";

export async function getStatsDashboard(req, res, next) {
  try {
    const { shopId } = req.params;
    if (!shopId) {
      return res.status(400).json({ message: "shopId est requis" });
    }

    const data = await getDashboardStats(shopId);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}