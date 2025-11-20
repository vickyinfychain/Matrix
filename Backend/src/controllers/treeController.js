// src/controllers/treeController.js
import { getUserTreeForSlot } from "../services/treeService.js";

export const getTree = async (req, res) => {
    try {
        const { slotNumber, userId } = req.params;

        if (!slotNumber || !userId) {
            return res.status(400).json({ error: "slotNumber and userId are required" });
        }

        const slotNum = Number(slotNumber);
        const uId = Number(userId);

        if (Number.isNaN(slotNum) || Number.isNaN(uId)) {
            return res.status(400).json({ error: "slotNumber and userId must be numbers" });
        }

        const tree = await getUserTreeForSlot(uId, slotNum);

        res.json(tree);
    } catch (err) {
        console.error("Get tree error:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};
