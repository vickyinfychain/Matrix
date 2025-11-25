import { Router } from "express";
import { listSlots, activateSlotController, activateUsingDividend } from "../controllers/slotController.js";
import seedSlots from "../seedSlots.js";

const router = Router();

router.get("/", listSlots);
router.post("/activate", activateSlotController);
router.post("/activate-using-dividend", activateUsingDividend);


router.post("/slot", seedSlots);
export default router;
