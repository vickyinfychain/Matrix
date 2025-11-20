import { Router } from "express";
import { register, getUser, getUserByWallet } from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.get("/by-wallet/:walletAddress", getUserByWallet);
router.get("/:userId", getUser);

export default router;
