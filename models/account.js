import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

export const accountModel = mongoose.model("account", {
    _id: { type: ObjectId, required: true, auto: true},
    user: { type: String, required: true, ref: "user-detail" },
    balance: { type: Number, required: true, default: 0 },
});