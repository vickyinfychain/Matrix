import { registerUser } from "../services/matrixService.js";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const { walletAddress, sponsorUserId } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: "walletAddress is required" });
        }

        const user = await registerUser(walletAddress, sponsorUserId);

        res.json({
            message: "User registered / logged in successfully",
            user,
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserByWallet = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const user = await User.findOne({ walletAddress }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Get user by wallet error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
