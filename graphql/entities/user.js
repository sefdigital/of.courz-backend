import * as middlewares from "../middlewares";
import { userDetailModel } from "../../models/user-detail";

export const queries = {
    me: async (parent, params, { user }) => {

        middlewares.isAuthorized(user);

        return await userDetailModel.findOne({ _id: user._id });
    }
};

export const mutations = {
    updateUserData: async (parent, { user: updatedUserData }, { user }) => {

        middlewares.isAuthorized(user);

        const userDetails = await userDetailModel.findOneAndUpdate({ _id: user._id }, updatedUserData, { new: true });

        if (!userDetails) throw new Error("Trying to edit different user");

        return userDetails;
    }
};

export const entities = {
    User: {
        birthday: u => u.birthday ? new Date(u.birthday).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10)
    }
};