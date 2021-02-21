import { ratingModel } from "../../models/rating";
import * as middleware from "../middlewares";

export const queries = {
};

export const mutations = {
    addRating: async (parent, { workshop, rating }, { user }) => {

        await middleware.isAuthorized(user);
        await middleware.ratingAllowed(user, workshop);

        rating = new ratingModel({ workshop, ...rating, author: user._id });

        await rating.save();

        return rating;
    },
};

export const entities = {
    Rating: {
        author: async r => (await r.populate("author").execPopulate()).author
    }
};