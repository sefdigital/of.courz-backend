import { workshopModel } from "../../models/workshop";
import { ratingModel } from "../../models/rating";

export const queries = {
};

export const mutations = {
    addRating: async (parent, { workshop, rating }, { user }) => {

        // ToDo: authorised
        // ToDo: booked

        console.log({ user });

        rating = new ratingModel({ ...rating, author: "test" });

        console.log(rating);

        await rating.save();

        workshop = await workshopModel.findOne({ _id: workshop });

        console.log(workshop);

        workshop.ratings.push(rating);

        await workshop.save();

        return rating;
    },
};