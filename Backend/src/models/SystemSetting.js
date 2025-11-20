import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
    {
        key: { type: String, unique: true },
        matrixPercentages: {
            level1Percent: Number,
            level2Percent: Number,
            level3Percent: Number,
            dividendPercent: Number,
            reentryReservePercent: Number,
        },
        roiMultiplier: { type: Number, default: 3 },
        maxChildrenPerPosition: { type: Number, default: 3 },
        matrixMaxLevels: { type: Number, default: 3 },
    },
    { timestamps: true }
);

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);
export default SystemSetting;
