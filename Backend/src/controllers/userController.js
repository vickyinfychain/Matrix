import { registerUser } from "../services/matrixService.js";
import User from "../models/User.js";
import MatrixPosition from "../models/MatrixPosition.js";
import DividendPoolRecord from "../models/DividendPoolRecord.js";

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



export const getFullUserMatrixData = async (req, res) => {
    try {
        const { walletAddress, userId } = req.body;
        if (!walletAddress && !userId) {
            return res.status(400).json({
                success: false,
                message: "walletAddress or userId is required",
            });
        }
        // 1. Fetch User
        const userSlot = await User.findOne({
            ...(walletAddress && { walletAddress }),
            ...(userId && { userId }),
        });
        console.log(userSlot);
        if (!userSlot) {
            return res.status(404).json({
                success: false,
                message: "UserSlot not found",
            });
        }
        // 2. MatrixPosition
        const matrixPosition = await MatrixPosition.findOne({
            userId: userSlot.userId,
        });
        // 3. Earnings
        const earnings = await Earning.find({
            userId: userSlot.userId,
        });
        // 4. Transactions (correct way)
        const transactions = await DividendPoolRecord.find({
            fromUser: userSlot._id          // <<:fire: FIXED
        });
        console.log(transactions);
        // Final Response
        return res.json({
            success: true,
            data: {
                user: {
                    userId: userSlot.userId,
                    walletAddress: userSlot.walletAddress,
                    totalInvested: userSlot.totalInvested,
                    totalEarned: userSlot.totalEarned,
                    roiCap: userSlot.roiCap,
                },
                matrix: matrixPosition
                    ? {
                          depth: matrixPosition.depth,
                          matrixCounts: matrixPosition.matrixCounts,
                          status: matrixPosition.status
                      }
                    : null,
                earnings: earnings.map((x) => ({
                    amountUSD: x.amountUSD,
                    type: x.type,
                    date: x.createdAt,
                })),
                transactions: transactions.map((t) => ({
                    amountUSD: t.amountUSD,
                    recordType: t.recordType,
                    fromUserObjectId: t.fromUser,
                    fromUserId: t.fromUserId,
                    slotNumber: t.slotNumber,
                    date: t.createdAt,
                })),
            },
        });
    } catch (error) {
        console.log("SERVER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};