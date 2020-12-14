import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

export const transactionTypes = {
    WORKSHOP_PAYMENT: "WORKSHOP_PAYMENT",
    AFFILIATE: "AFFILIATE",
    PAYOUT: "PAYOUT",
    OTHER: "OTHER"
};

export const transactionModel = mongoose.model("transaction", {
    _id: { type: ObjectId, required: true, auto: true},
    type: { required: true, type: String, enum: Object.values(transactionTypes) },
    account: { type: ObjectId, ref: "account", required: true },
    amount: { type: Number, required: true },
    bankAccount: { type: String },
    notes: { type: String }
});