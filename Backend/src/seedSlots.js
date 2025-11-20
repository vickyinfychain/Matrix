import "dotenv/config";
import connectDB from "./config/db.js";
import Slot from "./models/Slot.js";

async function run() {
    await connectDB();

    const prices = [
        1, 2, 4, 8, 16,
        32, 64, 128, 256, 512,
        1024, 2048, 4096, 8192, 16384,
    ];

    await Slot.deleteMany({});

    const docs = prices.map((price, idx) => ({
        slotNumber: idx + 1,
        priceUSD: price,
        orderIndex: idx + 1,
        isActive: true,
    }));

    await Slot.insertMany(docs);
    console.log("✅ Slots seeded");
    process.exit(0);
}

run();
