import mongoose from "mongoose";

const userDetailSchema = mongoose.Schema({
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    organizer: { type: Boolean, default: false },
    profilePicture: { type: String },
    email: { type: String, required: true },
    occupation: String,
    birthday: Date
}, { timestamps: true });

export const userDetailModel = mongoose.model("user-detail", userDetailSchema);

export function createUserDetail(user) {
    const userDetail = new userDetailModel({
        _id: user.uid,
        firstName: user.displayName || "Du", // ToDo: handle username correctly for email and password signups
        email: user.email,
        profilePicture: user.photoURL
    });

    userDetail.save();
}

export function deleteUserDetails(user) {
    // ToDo: delete workshops for that user
    userDetailModel.deleteOne({ _id: user.uid });
}