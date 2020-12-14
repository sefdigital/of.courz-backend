import orderModel from "../models/order";

export function isAuthorized(user) {
    if (!user) throw new Error("Unauthorized");
    else return true;
}

export async function hasBookedWorkshop(user, workshopID) {
    const order = await orderModel.exists({ workshop: workshopID, user: user.user_id });

    if(!order) throw new Error("No booking at workshop");
    else return true;
}