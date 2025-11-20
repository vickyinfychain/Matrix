import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        slotNumber: { type: Number, unique: true },
        priceUSD: { type: Number, required: true },
        orderIndex: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
