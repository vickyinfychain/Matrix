import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: { type: Number, unique: true, index: true }, // incremental
        walletAddress: { type: String, unique: true, index: true },

        sponsorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        sponsorUserId: { type: Number, index: true, default: null },

        directReferrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        totalInvested: { type: Number, default: 0 },   // sum of all slot investments
        totalEarned: { type: Number, default: 0 },     // sum of all incomes (level + dividend + etc.)
        roiCap: { type: Number, default: 0 },
        dividend: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User
