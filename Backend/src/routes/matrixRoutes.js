import { Router } from "express";
import MatrixPosition from "../models/MatrixPosition.js";

const router = Router();

router.post("/all", async (req, res) => {
    try {
        console.log("🔍 Fetching matrix positions...");
        
        // Get userId from request body
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: "User ID is required in request body" });
        }

        console.log(`👤 User ID from request body: ${userId}`);
        
        // Find positions directly by userId if it's stored in MatrixPosition
        const positions = await MatrixPosition.find({ userId: parseInt(userId) })
            .populate("user", "userId walletAddress")
            .populate("slot", "slotNumber priceUSD")
            .lean();

        console.log(positions);

        // Get level 1 user IDs for the current user's positions only
        const levelOneUserIdsPerSlot = {};
        
        // For each position of the current user, get their level 1 children
        for (const position of positions) {
            const slotNum = position.slotNumber;
            
            // Get the direct children for this position (these are level 1)
            const level1Children = await MatrixPosition.find({
                _id: { $in: position.children }
            })
            .populate("user", "userId walletAddress")
            .sort({ createdAt: 1 }) // Oldest first to get the first 3
            .limit(3)
            .lean();
            
            // Extract user IDs from level 1 children
            const level1UserIds = level1Children
                .filter(child => child.user && child.user.userId)
                .map(child => child.user.userId.toString());
            
            levelOneUserIdsPerSlot[slotNum] = level1UserIds;
            
            console.log(`📦 Slot ${slotNum} - Level 1 children:`, level1UserIds);
        }

        // Calculate matrix counts for the specific user
        const matrixCounts = {
            level1: positions.filter(p => p.level === 1).length,
            level2: positions.filter(p => p.level === 2).length,
            level3: positions.filter(p => p.level === 3).length,
            total: positions.length,
        };

        // Get the latest cycleIndex for the user
        const latestCycleIndex = positions.length > 0 
            ? Math.max(...positions.map(p => p.cycleIndex || 1))
            : 1;

        // Transform data
        const transformedPositions = positions.map(position => ({
            ...position,
            userId: position.user?.userId,
            userObjectId: position.user?._id
        }));

        // Create response
        const response = {
            positions: transformedPositions,
            summary: {
                userId: parseInt(userId),
                matrixCounts: matrixCounts,
                latestCycleIndex: latestCycleIndex,
                levelOneUserIdsPerSlot: levelOneUserIdsPerSlot,
                totalPositions: positions.length
            }
        };

        console.log(`✅ Found ${positions.length} positions for user ${userId}`);
        console.log(`📊 Matrix Counts:`, matrixCounts);
        console.log(`🔄 Latest Cycle Index: ${latestCycleIndex}`);
        console.log(`👥 Level 1 User IDs Per Slot for current user:`, levelOneUserIdsPerSlot);
        
        res.json(response);
        
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to fetch matrix positions" });
    }
});


export default router;
