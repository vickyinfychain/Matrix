// src/controllers/treeController.js
import MatrixPosition from "../models/MatrixPosition.js";
import { getUserTreeForSlot } from "../services/treeService.js";

export const getTree = async (req, res) => {
    try {
        const { slotNumber, userId, cycleIndex } = req.params;
        if (!slotNumber || !userId) {
            return res.status(400).json({ error: "slotNumber and userId are required" });
        }
        const slotNum = Number(slotNumber);
        const uId = Number(userId);
        if (Number.isNaN(slotNum) || Number.isNaN(uId)) {
            return res.status(400).json({ error: "slotNumber and userId must be numbers" });
        }
        // Use provided cycleIndex or default to 0
        const cycle = cycleIndex !== undefined ? Number(cycleIndex) : 0;
        const tree = await getUserTreeForSlot(uId, slotNum, cycle);
        // -------------------------------------------------------
        // Get matrixCounts directly from MatrixPosition document
        // -------------------------------------------------------
        const matrixPosition = await MatrixPosition.findOne({
            userId: uId,
            slotNumber: slotNum,
            cycleIndex: cycle
        });
        // Use the matrixCounts from the document, or default values if not found
        const rawMatrixCounts = matrixPosition?.matrixCounts || {
            level1: 0,
            level2: 0,
            level3: 0,
            total: 0,
        };
        // VALIDATE AND CORRECT THE MATRIX COUNTS TO NEVER EXCEED MAXIMUMS
        const matrixCounts = {
            level1: Math.min(rawMatrixCounts.level1, 3),  // Max 3 for level 1
            level2: Math.min(rawMatrixCounts.level2, 9),  // Max 9 for level 2
            level3: Math.min(rawMatrixCounts.level3, 27), // Max 27 for level 3
            total: Math.min(rawMatrixCounts.total, 39)    // Max 39 total (3+9+27)
        };
        // -------------------------------------------------------
        // Final response = tree + matrixCounts
        // -------------------------------------------------------
        res.json({
            ...tree,
            matrixCounts,
            cycleIndex: cycle
        });
    } catch (err) {
        console.error("Get tree error:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};