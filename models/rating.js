import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

const ratingSchema = mongoose.Schema({
    _id: { type: ObjectId, required: true, auto: true },
    workshop: { type: ObjectId, required: true, ref: "workshop" },
    content: { type: Number, required: true },
    composition: { type: Number, required: true },
    clarity: { type: Number, required: true },
    expertise: { type: Number, required: true },
    goalAchievement: { type: Number, required: true },
    text: { type: String },
    author: { type: String, required: true, ref: "user-detail"}
});

ratingSchema.virtual("average").get(function () {
    return (this.content + this.composition + this.clarity + this.expertise + this.goalAchievement) / 5;
});

export const ratingModel = mongoose.model("rating", ratingSchema);