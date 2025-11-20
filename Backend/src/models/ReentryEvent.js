import mongoose from "mongoose";

const reentryEventSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        userId: { type: Number, index: true },

        slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", index: true },
        slotNumber: { type: Number, index: true },

        completedPosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" },
        newPosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" },

        cycleIndexBefore: { type: Number },
        cycleIndexAfter: { type: Number },

        triggeredByPosition: { type: mongoose.Schema.Types.ObjectId, ref: "MatrixPosition" },
    },
    { timestamps: true }
);

const ReentryEvent = mongoose.model("ReentryEvent", reentryEventSchema);
export default ReentryEvent;
