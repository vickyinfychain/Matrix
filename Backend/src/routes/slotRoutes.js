import { Router } from "express";
import { listSlots, activateSlotController, activateUsingDividend } from "../controllers/slotController.js";
import seedSlots from "../seedSlots.js";
import User from "../models/User.js";

const router = Router();

router.get("/", listSlots);
router.post("/activate", activateSlotController);
router.post("/activate-using-dividend", activateUsingDividend);

router.post("/dividend/claim", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing userId or amount" });
    }

    const user = await User.findOne({ userId: Number(userId) });

    if (!user) return res.status(404).json({ error: "User not found" });

    const available = user.dividend || 0;
    const claimAmount = Number(amount);

    if (claimAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (claimAmount > available) {
      return res.status(400).json({ error: "Amount exceeds dividend" });
    }

    // 🔥 ONLY DEDUCT — NO Earning.create()
    user.dividend = available - claimAmount;
    await user.save();

    return res.json({
      success: true,
      message: `Successfully claimed $${claimAmount}`,
      remainingDividend: user.dividend,
    });

  } catch (error) {
    console.error("Dividend claim error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/slot", seedSlots);
export default router;
