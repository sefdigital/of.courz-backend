import { workshopModel } from "../../models/workshop";
import { categoryModel } from "../../models/category";
import { ratingModel } from "../../models/rating";
import mongoose from "mongoose";
import * as middlewares from "../middlewares";

function convertCategoriesToString(workshop) {
    workshop.categories = workshop.categories.map(category => category.name);
    return workshop;
}

export const queries = {
    allWorkshops: async () => {
        let workshops = await workshopModel.find({}).populate("categories").populate("organizer").exec();

        workshops = workshops.map(w => w.toObject()).map(convertCategoriesToString);

        return workshops;
    }
};

export const mutations = {
    addWorkshop: async (parent, { workshop }, { user }) => {

        middlewares.isAuthorized(user);

        // todo: check if wsl'lere

        // convert category strings to ids
        workshop.categories = await Promise.all(workshop.categories.map(async category => (await categoryModel.findOne({ name: category }))._id));
        workshop.organizer = user._id;

        // create mongoose workshop from args
        workshop = new workshopModel(workshop);

        // save workshop in db
        await workshop.save();

        console.log(`Created workshop ${workshop.title} by ${workshop.organizer}`);

        return workshop;
    },
    addCategory: async (parent, { name }) => {
        try {
            let c = new categoryModel({ _id: new mongoose.Types.ObjectId(), name });
            await c.save();
        } catch (e) {
            // ToDo: handle error
        }

        return name;
    }
};

export const entities = {
    Date: {
        startTime: p => new Date(p.startTime).toISOString(),
        endTime: p => new Date(p.endTime).toISOString()
    },
    Workshop: {
        ratings: async w => await Promise.all(w.ratings.map(async r => await ratingModel.findOne({ _id: r })))
    }
};