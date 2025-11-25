import User from "../models/User.js";
import Slot from "../models/Slot.js";
import { activateSlot, createMatrixPosition } from "../services/matrixService.js";
import UserSlot from "../models/UserSlot.js";

export const activateSlotController = async (req, res) => {
    try {
        const { walletAddress, slotNumber } = req.body;

        if (!walletAddress || !slotNumber) {
            return res.status(400).json({ error: "walletAddress and slotNumber are required" });
        }

        const user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please register first." });
        }

        const slot = await Slot.findOne({ slotNumber });
        if (!slot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        const position = await activateSlot(user, slotNumber);

        res.json({
            message: "Slot activated and position created",
            position,
        });
    } catch (err) {
        console.error("Activate slot error:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

export const listSlots = async (req, res) => {
    try {
        const slots = await Slot.find().sort({ slotNumber: 1 }).lean();
        res.json(slots);
    } catch (err) {
        console.error("List slots error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};








export async function activateUsingDividend(req, res) {
  try {
    const { walletAddress, slotNumber } = req.body;

    if (!walletAddress || !slotNumber) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const slot = await Slot.findOne({ slotNumber });
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Check dividend balance
    if ((user.dividend || 0) < slot.priceUSD) {
      return res.status(400).json({ error: "Not enough dividend balance" });
    }

    // Deduct dividend
    user.dividend = (user.dividend || 0) - slot.priceUSD;

    // Update global investment tracking
    user.totalInvested += slot.priceUSD;
    user.roiCap = user.totalInvested * 3;

    await user.save();

    // Activate user slot
    let userSlot = await UserSlot.findOne({ user: user._id, slot: slot._id });

    if (!userSlot) {
      userSlot = await UserSlot.create({
        user: user._id,
        userId: user.userId,
        slot: slot._id,
        slotNumber,
        totalInvested: 0,
        totalEarned: 0,
        roiCap: 0,
        isActive: false,
      });
    }

    userSlot.totalInvested += slot.priceUSD;
    userSlot.isActive = true;
    userSlot.roiCap = user.roiCap;

    await userSlot.save();

    // Create matrix position
    const position = await createMatrixPosition(user, slot, {
      isReentry: false,
      cycleIndex: 1,
    });

    // No dividend added here because user already paid via dividend

    return res.json({
      message: "Slot activated using dividend",
      position,
    });

  } catch (error) {
    console.error("Dividend activation error:", error);
    return res.status(500).json({ error: "Server error during dividend activation" });
  }
}
