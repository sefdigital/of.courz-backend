import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

const ratingSchema = mongoose.Schema({
    _id: { type: ObjectId, required: true, auto: true },
    workshop: { type: ObjectId, required: true, ref: "workshop" },
    author: { type: String, required: true, ref: "user-detail"},

    organizerRating: {
        friendly: { type: Boolean, required: true },
        reliable: { type: Boolean, required: true },
        knowledge: { type: Boolean, required: true },
        patience: { type: Boolean, required: true },
        rating: { type: Number, required: true },
    },

    workshopRating: {
        recommendable: { type: Boolean, required: true },
        content: { type: Boolean, required: true },
        entertaining: { type: Boolean, required: true },
        rating: { type: Number, required: true }
    },

    text: { type: String },
    improveable: { type: String }

}, { timestamps: true });

ratingSchema.virtual("average").get(function () {
    return (this.content + this.composition + this.clarity + this.expertise + this.goalAchievement) / 5;
});

export const ratingModel = mongoose.model("rating", ratingSchema);