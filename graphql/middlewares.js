import orderModel from "../models/order";
import { userDetailModel } from "../models/user-detail";

export function isAuthorized(user) {
    if (!user) throw new Error("Unauthorized");
    else return true;
}

export async function hasBookedWorkshop(user, workshopID) {
    const order = await orderModel.exists({ workshop: workshopID, user: user._id });

    if (!order) throw new Error("No booking at workshop");
    else return true;
}

export async function isOrganizer(user) {
    const userDetails = userDetailModel.find({ _id: user._id });
    if (!userDetails || !userDetails.organizer) throw new Error("You are not a workshop organizer");
    else return true;
}