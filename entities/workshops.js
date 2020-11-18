import { workshopModel } from "../models/workshop.js"
import { categoryModel } from "../models/category";

function convertCategoriesToString(workshop) {
    workshop.categories = workshop.categories.map(category => category.name);
    return workshop;
}

function minValue(array, attribute) {
    return Math.min.apply(Math, array.map(event => event[attribute]));
}

function createCalculatedFields(workshop) {

    // filter for events which have not been started
    let notStartedEvents = workshop.events.filter(event => event.dates.every(date => date.startTime > Date.now()));

    // sort events based on minimum start time
    notStartedEvents = notStartedEvents.sort((a, b) => minValue(a.dates, "startTime") - minValue(b.dates, "startTime"));

    let minPrice = minValue(notStartedEvents, "price");
    let nextDate = notStartedEvents.length === 0 ? null : minValue(notStartedEvents[0].dates, "startTime");
    let nextDuration = notStartedEvents.length === 0 ? null : notStartedEvents[0].dates.map(date => date.endTime - date.startTime).reduce((a, b) => a + b);
    let nextParticipants = notStartedEvents.length === 0 ? null : notStartedEvents[0].maxParticipants

    return {
        ...workshop, minPrice, nextDuration, nextDate, nextParticipants
    };
}

export const queries = {
    workshops: async () => {
        let workshops = await workshopModel.find({ }).populate("categories");

        workshops = workshops.map(w => w.toObject()).map(convertCategoriesToString).map(createCalculatedFields);

        return workshops;
    }
}

export const mutations = {
    addWorkshop: async (parent, { workshop }) => {

        // convert category strings to ids
        workshop.categories = await Promise.all(workshop.categories.map(async category => (await categoryModel.findOne({ name: category }))._id));

        // ToDo: set organizer by firebase function caller
        workshop.organizer = process.env.DEFAULT_USER;

        // create mongoose workshop from args
        workshop = new workshopModel(workshop);

        // save workshop in db
        await workshop.save();

        console.log(`Created workshop ${workshop.title} by ${workshop.organizer}`)

        return workshop;
    }
}

export const entities = {
    Date: {
        startTime: p => new Date(p.startTime).toISOString(),
        endTime: p => new Date(p.endTime).toISOString()
    },
    Workshop: {
        nextDate: p => new Date(p.nextDate).toISOString()
    }
}