import { getParticipantsForEvent, visibilityEnum, workshopModel } from "../../models/workshop";
import { categoryModel } from "../../models/category";
import { ratingModel } from "../../models/rating";
import * as middlewares from "../middlewares";

export const queries = {
    allWorkshops: async () => {
        let workshops = await workshopModel.find({ visibility: { $ne: visibilityEnum.CHECK_PENDING }, }).exec();
        return workshops.map(w => w.removeEvents());
    }
};

export const mutations = {
    addWorkshop: async (parent, { workshop }, { user }) => {

        await middlewares.isAuthorized(user);
        await middlewares.isOrganizer(user);

        // convert category strings to ids
        workshop.categories = await Promise.all(workshop.categories.map(async category => (await categoryModel.findOne({ name: category }))._id));
        workshop.organizer = user._id;

        // create mongoose workshop from args
        workshop = new workshopModel(workshop);

        // save workshop in db
        await workshop.save();

        console.log(`Created workshop ${workshop.title} by ${workshop.organizer}`);

        return workshop;
    }
};

export const entities = {
    WorkshopDateInterval: {
        startTime: p => new Date(p.startTime).toISOString(),
        endTime: p => new Date(p.endTime).toISOString()
    },
    Workshop: {
        organizer: async w => (await w.populate("organizer").execPopulate()).organizer,
        ratings: async w => await ratingModel.find({ workshop: w._id }),
        categories: async w => (await w.populate("categories").execPopulate()).categories.map(c => c.name)
    },
    Event: {
        privateLocation: async (event, ignore, { user }) => {
            const allowed = (await middlewares.isAuthorized(user)) && (await middlewares.isOrganizerOfEvent(user, event)) || (await middlewares.hasBookedEvent(user, event));
            if (allowed) return event.privateLocation;
        },
        currentParticipants: async e => await getParticipantsForEvent(null, e._id)
    }
};