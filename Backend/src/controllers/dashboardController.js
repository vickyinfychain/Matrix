import { getUserDashboard, getUserEarnings } from "../services/matrixService.js";

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const dashboard = await getUserDashboard(Number(userId));
    res.json(dashboard);
  } catch (err) {
    console.error("Get dashboard error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const earnings = await getUserEarnings(Number(userId), Number(limit));
    res.json(earnings);
  } catch (err) {
    console.error("Get earnings error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};