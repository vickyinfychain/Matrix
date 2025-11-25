import Slot from "./models/Slot.js";

export default async function seedSlots(req, res) {
    try {
        const prices = [
            1, 2, 4, 8, 16,
            32, 64, 128, 256, 512,
            1024, 2048, 4096, 8192, 16384,
        ];

        // DELETE OLD SLOTS
        await Slot.deleteMany({});

        // MAKE NEW SLOTS
        const docs = prices.map((price, index) => ({
            slotNumber: index + 1,
            priceUSD: price,
            orderIndex: index + 1,
            isActive: true,
        }));

        await Slot.insertMany(docs);

        return res.json({
            status: true,
            message: "Slots seeded successfully",
            count: docs.length
        });

    } catch (err) {
        console.log("Seed Error:", err);
        return res.status(500).json({
            status: false,
            error: "Something went wrong while seeding slots"
        });
    }
}
