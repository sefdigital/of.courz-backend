import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

export const ratingModel = mongoose.model("rating", {
    _id: { type: ObjectId, required: true, auto: true },
    content: { type: Number, required: true },
    composition: { type: Number, required: true },
    clarity: { type: Number, required: true },
    expertise: { type: Number, required: true },
    goalAchievement: { type: Number, required: true },
    text: { type: String },
    author: { type: String, required: true }
});