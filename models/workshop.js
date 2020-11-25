import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

require("mongoose-type-url");

export const workshopModel = mongoose.model("workshop", {
    _id: { type: ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    organizer: { type: String, required: true },
    events: [{
        _id: { type: ObjectId, required: true, auto: true },
        price: { type: Number, required: true },
        dates: [{
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true }
        }],
        notes: String,
        publicLocation: { type: String, required: true },
        privateLocation: String,
        maxParticipants: Number
    }],
    requirements: String,
    material: String,
    description: { type: String, required: true },
    categories: [{ type: ObjectId, ref: "category" }],
    ratings: [{ type: ObjectId, ref: "rating" }],
    thumbnail: { type: mongoose.SchemaTypes.Url, required: true },
});