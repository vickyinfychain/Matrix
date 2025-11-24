import { Router } from "express";
import { listSlots, activateSlotController } from "../controllers/slotController.js";
import seedSlots from "../seedSlots.js";

const router = Router();

router.get("/", listSlots);
router.post("/activate", activateSlotController);


router.post("/slot", seedSlots);
export default router;
