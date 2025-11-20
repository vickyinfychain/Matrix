import mongoose from "mongoose";

const dividendPoolRecordSchema = new mongoose.Schema(
    {
        recordType: { type: String, enum: ["IN", "OUT"], required: true },
        amountUSD: { type: Number, required: true },

        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        fromUserId: { type: Number, default: null },
        slotNumber: { type: Number, default: null },

        distributionDate: { type: Date, default: null },
        distributionBatchId: { type: String, default: null },
    },
    { timestamps: true }
);

const DividendPoolRecord = mongoose.model("DividendPoolRecord", dividendPoolRecordSchema);
export default DividendPoolRecord;
