import mongoose from "mongoose";

const matrixPositionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        userId: { type: Number, index: true },

        slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", index: true },
        slotNumber: { type: Number, index: true },

        parentPosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition", default: null },
        children: [{ type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" }],

        depth: { type: Number, default: 0 },

        sponsorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        sponsorUserId: { type: Number, default: null },

        isReentry: { type: Boolean, default: false },
        cycleIndex: { type: Number, default: 1 },

        matrixCounts: {
            level1: { type: Number, default: 0 },
            level2: { type: Number, default: 0 },
            level3: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
        },

        matrixCompleted: { type: Boolean, default: false },
        status: { type: String, enum: ["ACTIVE", "COMPLETED"], default: "ACTIVE" },
    },
    { timestamps: true }
);

const MatrixPosition = mongoose.model("MatrixPosition", matrixPositionSchema);
export default MatrixPosition;
