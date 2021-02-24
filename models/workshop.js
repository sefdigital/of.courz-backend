import mongoose from "mongoose";
import ObjectId from "mongoose/lib/schema/objectid";
import { orderModel, paymentStatusCodes } from "./order";
import dayjs from "dayjs";
import "dayjs/locale/de";

require("mongoose-type-url");

export const visibilityEnum = {
    VISIBLE: "VISIBLE",
    HIDDEN: "HIDDEN",
    DISABLED: "DISABLED", // we disabled the workshop for whatever reason
    CHECK_PENDING: "CHECK_PENDING",
};

const visibility = { type: String, enum: Object.keys(visibilityEnum), default: visibilityEnum.CHECK_PENDING };

const workshopSchema = mongoose.Schema({
    _id: { type: ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    visibility,
    organizer: { type: String, required: true, ref: "user-detail" },
    events: [{
        _id: { type: ObjectId, required: true, auto: true },
        price: { type: Number, required: true },
        dates: [{
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true }
        }],
        visibility,
        notes: String,
        publicLocation: { type: String, required: true },
        privateLocation: String,
        maxParticipants: { type: Number, required: true }
    }],
    takeaway: { type: String, required: true },
    description: { type: String, required: true },
    content: String,
    requirements: String,
    categories: [{ type: ObjectId, ref: "category" }],
    thumbnail: { type: mongoose.SchemaTypes.Url, required: true },
}, { timestamps: true });

workshopSchema.methods.removeEvents = function () {
    this.events = this.events.filter(event => event.visibility !== visibilityEnum.CHECK_PENDING);
    return this;
};

workshopSchema.methods.getEventById = function (eventID) {
    const events = this.events.filter(a => a._id.toString() === eventID.toString());

    if (events.length === 0) return null;
    else return events[0];
};

export function addDateTimeString(date) {
    const workshopDateFormatTemplate = "ddd, DD.MM.YYYY HH:mm";
    dayjs.locale("de");

    let dates = [dayjs(date.startTime), dayjs(date.endTime)];
    let sameDay = dates[0].isSame(dates[1], "day");

    let timeString;

    if (sameDay)
        timeString = `${dates[0].format(workshopDateFormatTemplate)} - ${dates[1].format("HH:mm")}`;
    else
        timeString = `${dates[0].format(workshopDateFormatTemplate)} - ${dates[1].format(workshopDateFormatTemplate)}`;

    return {
        startTime: +dayjs(date.startTime),
        endTime: +dayjs(date.endTime),
        timeString: timeString
    };
}

export function convertCategoriesToString(workshop) {
    workshop.categories = workshop.categories.map(category => category.name);
    return workshop;
}

export async function getParticipantsForEvent(workshopID, eventID) {
    const participants = await orderModel.aggregate([
        {
            $match: {
                event: eventID,
                status: { $nin: [ paymentStatusCodes.SHOULD_BE_DELETED, paymentStatusCodes.REFUNDED ] },
                ...workshopID ? { workshop: workshopID } : {}
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$participants"
                }
            }
        }]).exec();

    if (participants.length === 0)
        return 0;
    else return participants[0].total;
}

export const workshopModel = mongoose.model("workshop", workshopSchema);