import mongoose from "mongoose";

const userSlotSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        userId: { type: Number, index: true },
        slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", index: true },
        slotNumber: { type: Number, index: true },

        totalInvested: { type: Number, default: 0 },
        totalEarned: { type: Number, default: 0 },
        roiCap: { type: Number, default: 0 },

        isActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSlotSchema.index({ user: 1, slot: 1 }, { unique: true });

const UserSlot = mongoose.model("UserSlot", userSlotSchema);
export default UserSlot;
