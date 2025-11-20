import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        userId: { type: Number, index: true },

        slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", index: true },
        slotNumber: { type: Number, index: true },

        amountUSD: { type: Number, required: true },
        type: { type: String, enum: ["LEVEL1", "LEVEL2", "LEVEL3", "DIVIDEND", "OTHER"], required: true },

        sourcePosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" },
        uplinePosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" },
    },
    { timestamps: true }
);

const Earning = mongoose.model("Earning", earningSchema);
export default Earning;
