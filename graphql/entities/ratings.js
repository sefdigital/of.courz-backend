import { ratingModel } from "../../models/rating";
import * as middleware from "../middlewares";
import { workshopModel } from "../../models/workshop";

export const queries = {};

export const mutations = {
    addRating: async (parent, { workshop, rating }, { user }) => {

        await middleware.isAuthorized(user);
        await middleware.ratingAllowed(user, workshop);

        const organizer = (await workshopModel.findOne({ _id: workshop }).exec()).organizer;

        rating = new ratingModel({ workshop, ...rating, author: user._id, organizer });

        await rating.save();

        return rating;
    },
};

export const entities = {
    Rating: {
        author: async r => (await r.populate("author").execPopulate()).author
    }
};