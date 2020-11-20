import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

export const bookingModel = mongoose.model('booking', {
    order: { type: String, required: true },
    workshop: { type: ObjectId, ref: 'workshop' },
    event: { type: ObjectId },
    user: { type: String, required: true },
    affiliate: String
})