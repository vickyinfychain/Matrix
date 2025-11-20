import { Router } from "express";
import { listSlots, activateSlotController } from "../controllers/slotController.js";

const router = Router();

router.get("/", listSlots);
router.post("/activate", activateSlotController);

export default router;
