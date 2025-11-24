import { Router } from "express";
import { register, getUser, getUserByWallet, getFullUserMatrixData } from "../controllers/userController.js";
import MatrixPosition from "../models/MatrixPosition.js";
import User from "../models/User.js";

const router = Router();

router.post("/register", register);
router.get("/by-wallet/:walletAddress", getUserByWallet);
router.get("/:userId", getUser);


router.post("/getFullUserMatrixData", getFullUserMatrixData);

// Add this to your backend routes
router.get("/user/:userId/slot/:slotNumber/cycles", async (req, res) => {
  try {
    const { userId, slotNumber } = req.params;
    
    // Find all matrix positions for this user in this slot
    const positions = await MatrixPosition.find({
      userId: Number(userId),
      slotNumber: Number(slotNumber)
    }).select('cycleIndex').lean();

    // Extract unique cycle indexes and sort them
    const availableCycles = [...new Set(positions.map(pos => pos.cycleIndex))].sort((a, b) => a - b);
    
    res.json({ availableCycles });
  } catch (error) {
    console.error("Error fetching available cycles:", error);
    res.status(500).json({ error: "Failed to fetch available cycles" });
  }
});

// Bulk User Registration Route with default sponsor 1
router.post("/bulk-register", async (req, res) => {
    try {
        const { count, startFrom = 1, walletPrefix = "0xEfB84C6b11c464800F8bE99620b2298c393d08B", sponsorUserId = 1 } = req.body;

        if (!count || count < 1) {
            return res.status(400).json({ error: "Count is required and must be greater than 0" });
        }

        console.log(`🆕 Bulk registration request: ${count} users starting from ${startFrom}, Sponsor: ${sponsorUserId}`);

        // Validate sponsor user exists
        const sponsorUser = await User.findOne({ userId: sponsorUserId });
        if (!sponsorUser) {
            return res.status(400).json({ error: `Sponsor user ${sponsorUserId} not found` });
        }

        const registeredUsers = [];
        const errors = [];

        // Get the last user ID to continue from
        const lastUser = await User.findOne().sort({ userId: -1 });
        let nextUserId = lastUser ? lastUser.userId + 1 : startFrom;

        // Base wallet address (without the last character)
        const baseWallet = walletPrefix;
        
        // Starting character for wallet addresses (b1, b2, b3, etc.)
        let walletCounter = 1;

        for (let i = 0; i < count; i++) {
            try {
                // Generate wallet address: base + b + counter
                const walletAddress = `${baseWallet}b${walletCounter}`;
                
                // Check if user already exists
                const existingUser = await User.findOne({ walletAddress });
                if (existingUser) {
                    errors.push(`User ${nextUserId + i} already exists`);
                    walletCounter++;
                    continue;
                }

                // Create new user with sponsor
                const user = new User({
                    userId: nextUserId + i,
                    walletAddress: walletAddress,
                    sponsorUserId: sponsorUserId,
                    registeredAt: new Date(),
                    isActive: true
                });

                await user.save();

                registeredUsers.push({
                    userId: user.userId,
                    walletAddress: user.walletAddress,
                    sponsorUserId: user.sponsorUserId,
                    registeredAt: user.registeredAt
                });

                console.log(`✅ Registered user ${user.userId} with sponsor ${sponsorUserId}: ${walletAddress}`);
                
                // Increment wallet counter for next user
                walletCounter++;

            } catch (userError) {
                errors.push(`Failed to register user ${nextUserId + i}: ${userError.message}`);
                walletCounter++;
            }
        }

        res.json({
            message: `Bulk registration completed`,
            summary: {
                requested: count,
                registered: registeredUsers.length,
                failed: errors.length,
                startUserId: nextUserId,
                endUserId: nextUserId + registeredUsers.length - 1,
                startWallet: `${baseWallet}b1`,
                endWallet: `${baseWallet}b${walletCounter - 1}`,
                sponsorUserId: sponsorUserId
            },
            registeredUsers: registeredUsers,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (err) {
        console.error("❌ Bulk register error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;