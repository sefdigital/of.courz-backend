import { workshopModel } from "../models/workshop.js"
import { categoryModel } from "../models/category";

function convertCategoriesToString(workshop) {
    workshop.categories = workshop.categories.map(category => category.name);
    return workshop;
}

export const queries = {
    workshops: async () => {
        let workshops = await workshopModel.find({ }).populate("categories");

        workshops = workshops.map(w => w.toObject()).map(convertCategoriesToString);

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
    }
}