import User from "../models/User.js";
import Slot from "../models/Slot.js";
import { activateSlot } from "../services/matrixService.js";

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


