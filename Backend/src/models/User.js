import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: { type: Number, unique: true, index: true }, // incremental
        walletAddress: { type: String, unique: true, index: true },

        sponsorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        sponsorUserId: { type: Number, index: true, default: null },

        directReferrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User
