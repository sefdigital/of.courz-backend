import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

require("mongoose-type-url");

export const visibilityEnum = {
    ALL: "ALL",
    FOLLOWING: "FOLLOWING",
    HIDDEN: "HIDDEN",
    DISABLED: "DISABLED"
};

const visibility = { type: String, enum: Object.keys(visibilityEnum) };

const workshopSchema = mongoose.Schema({
    _id: { type: ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    visibility,
    organizer: { type: String, required: true, ref: "user-detail" },
    events: [{
        _id: { type: ObjectId, required: true, auto: true },
        price: { type: Number, required: true },
        dates: [{
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true }
        }],
        visibility,
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

workshopSchema.methods.getEventById = function (eventID) {
    const events = this.events.filter(a => a._id.toString() === eventID.toString());

    if (events.length === 0) return null;
    else return events[0];
};

export function convertCategoriesToString(workshop) {
    workshop.categories = workshop.categories.map(category => category.name);
    return workshop;
}

export const workshopModel = mongoose.model("workshop", workshopSchema);