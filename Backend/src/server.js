import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import models
import User from "./models/User.js";
import Slot from "./models/Slot.js";
import MatrixPosition from "./models/MatrixPosition.js";
import UserSlot from "./models/UserSlot.js";
import Earning from "./models/Earning.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import treeRoutes from "./routes/treeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/matrix");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

await connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/tree", treeRoutes);
app.use("/api/dasboard", dashboardRoutes)

// Debug endpoints
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/debug/positions", async (req, res) => {
  try {
    const positions = await MatrixPosition.find()
      .populate("user", "userId walletAddress")
      .populate("slot", "slotNumber priceUSD")
      .lean();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Matrix Plan Backend is running ✅",
    version: "1.0.0"
  });
});

// Initialize slots if they don't exist
app.post("/api/init-slots", async (req, res) => {
  try {
    const slots = [
      { slotNumber: 1, priceUSD: 1, orderIndex: 1, isActive: true },
      { slotNumber: 2, priceUSD: 2, orderIndex: 2, isActive: true },
      { slotNumber: 3, priceUSD: 3, orderIndex: 3, isActive: true },
      { slotNumber: 4, priceUSD: 4, orderIndex: 4, isActive: true },
      { slotNumber: 5, priceUSD: 5, orderIndex: 5, isActive: true },
    ];

    for (const slotData of slots) {
      await Slot.findOneAndUpdate(
        { slotNumber: slotData.slotNumber },
        slotData,
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Slots initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});