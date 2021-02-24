import mongoose from "mongoose";
import { subscribeNewUser } from "../mail";

const userDetailSchema = mongoose.Schema({
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    organizer: { type: Boolean, default: false },
    profilePicture: { type: String },
    email: { type: String, required: true },
    contact: {
        whatsapp: String,
        messenger: String
    },
    occupation: String,
    birthday: Date
}, { timestamps: true });

export const userDetailModel = mongoose.model("user-detail", userDetailSchema);

export function createUserDetail(user) {
    console.log(`ADDING USER ${JSON.stringify(user)}`);

    const userDetail = new userDetailModel({
        _id: user.uid,
        firstName: user.displayName || "Kunde",
        email: user.email,
        profilePicture: user.photoURL
    });

    userDetail.save();
    subscribeNewUser(userDetail.email, userDetail.firstName);

}

export function deleteUserDetails(user) {
    // ToDo: delete workshops for that user
    userDetailModel.deleteOne({ _id: user.uid });
}