import { userDetailModel } from "../models/user-detail";
import { orderModel } from "../models/order";

export function isAuthorized(user) {
    if (!user) throw new Error("Unauthorized");
    else return true;
}

// ToDo: check the booking status
export async function hasBookedWorkshop(user, workshopID) {
    const exists = await orderModel.exists({ workshop: workshopID, user: user._id });

    if (!exists) throw new Error("No booking for this workshop");
    else return true;
}

export async function isOrganizer(user) {
    const userDetails = userDetailModel.find({ _id: user._id });
    if (!userDetails || !userDetails.organizer) throw new Error("You are not a workshop organizer");
    else return true;
}