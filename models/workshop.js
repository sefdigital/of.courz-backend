import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

require('mongoose-type-url');

export const workshopModel = mongoose.model('workshop', {
    title: { type: String, required: true },
    subTitle: { type: String },
    organizer: { type: String, required: true },
    events: [{
        price: { type: Number, required: true },
        dates: [{
            startTime: { type: Number, required: true },
            endTime: { type: Number, required: true }
        }],
        notes: String,
        publicLocation: { type: String, required: true },
        privateLocation: String,
        maxParticipants: Number
    }],
    requirements: String,
    material: String,
    description: { type: String, required: true },
    categories: [{ type: ObjectId, ref: 'category' }],
    thumbnail: { type: mongoose.SchemaTypes.Url, required: true },
})