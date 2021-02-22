import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";
import { createAffiliateTransaction } from "../logic/affiliate/createAffiliateTransaction";
import { businessLogic } from "../businessLogic";
import { sendOrderSuccessfulMail } from "../mail";

export const paymentStatusCodes = {
    PENDING: "PENDING",
    PAYED: "PAYED",
    REVIEW: "REVIEW",
    REFUNDED: "REFUNDED"
};

const orderSchema = mongoose.Schema({
    _id: { type: String, required: true }, // paypal order id
    workshop: { type: ObjectId, ref: "workshop", required: true },
    event: { type: ObjectId, required: true },
    user: { type: String, required: true, ref: "user-detail" },
    price: { type: Number, required: true },
    participants: { type: Number, required: true },
    status: { type: String, enum: Object.values(paymentStatusCodes) },
    affiliate: String
}, { timestamps: true });

orderSchema.methods.updateStatus = function (status) {
    this.status = status;

    switch (status) {
        case "PAYED":
            sendOrderSuccessfulMail(this);
            this.initializeAffiliate();
            break;
    }

    return this;
};

orderSchema.methods.initializeAffiliate = function ( ) {
    if (!this.affiliate)
        return;

    createAffiliateTransaction({
        amount: this.price * businessLogic.participantAffiliatePercentage,
        user: this.affiliate
    });
};

export const orderModel = mongoose.model("order", orderSchema);