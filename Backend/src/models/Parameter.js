import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema(
    {
        dividend: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Parameter = mongoose.model("Parameter", parameterSchema);
export default Parameter
