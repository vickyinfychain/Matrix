// src/routes/treeRoutes.js
import { Router } from "express";
import { getTree } from "../controllers/treeController.js";

const router = Router();

// /api/tree/:slotNumber/:userId
router.get("/:slotNumber/:userId/:cycleIndex", getTree);

export default router;
