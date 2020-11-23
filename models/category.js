import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";

require('mongoose-type-url');

export const categoryModel = mongoose.model('category', {
    _id: { type: ObjectId, auto: true },
    name: { type: String, unique: true, required: true }
});