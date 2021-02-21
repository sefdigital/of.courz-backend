import { userDetailModel } from "../models/user-detail";
import { orderModel, paymentStatusCodes } from "../models/order";
import { workshopModel } from "../models/workshop";
import { ratingModel } from "../models/rating";

export function isAuthorized(user) {
    if (!user) throw new Error("Unauthorized");
    else return true;
}

export async function hasBookedWorkshop(user, workshopID) {
    const order = await orderModel.findOne({ workshop: workshopID, user: user._id, status: paymentStatusCodes.PAYED });

    if (!order) throw new Error("No paid booking for this workshop");
    else return order;
}

export async function ratingAllowed(user, workshop) {
    const order = await hasBookedWorkshop(user, workshop);

    // check if event already started
    const event = (await workshopModel.findOne({ _id: order.workshop })).getEventById(order.event);
    const firstDate = event.dates.map(d => new Date(d.startTime)).sort((a, b) => a - b)[0];
    if (firstDate > new Date())
        throw new Error("The workshop has not started yet");

    // not already reviewed
    const ratingExists = await ratingModel.exists({ author: user._id, workshop: workshop });
    if (ratingExists)
        throw new Error("You already reviewed the workshop");
}

export async function isOrganizerOfEvent(user, event) {
    return await workshopModel.exists({ organizer: user._id, events: { $elemMatch: { _id: event._id } } });
}

export async function hasBookedEvent(user, event) {
    return await orderModel.exists({ event: event._id, user: user._id, status: paymentStatusCodes.PAYED });
}

export async function isOrganizer(user) {
    const userDetails = userDetailModel.find({ _id: user._id });
    if (!userDetails || !userDetails.organizer) throw new Error("You are not a workshop organizer");
    else return true;
}