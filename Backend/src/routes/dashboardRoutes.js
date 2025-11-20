import { Router } from "express";
import { getDashboard, getEarnings } from "../controllers/dashboardController.js";

const router = Router();

router.get("/:userId", getDashboard);
router.get("/:userId/earnings", getEarnings);

export default router;