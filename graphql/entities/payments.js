import { createOrder } from "../../logic/orders/createOrder";
import * as middlewares from "../middlewares";
import { orderModel, paymentStatusCodes } from "../../models/order";
import { workshopModel } from "../../models/workshop";

export const queries = {
    getOrderDetails: async (parent, { id }, { user }) => {
        middlewares.isAuthorized(user);

        let order = await orderModel.findOne({ _id: id, user: user._id, status: { $ne: paymentStatusCodes.SHOULD_BE_DELETED} });

        if (!order) throw new Error("No order with specified id");

        return order;
    },
    myOrders: async (parent, params, { user }) => {

        middlewares.isAuthorized(user);

        return await orderModel.find({ user: user._id }, null, { sort: { timestamp: "desc" } });
    }
};

export const mutations = {

    createOrder: async (parent, parameters, { user }) => {
        middlewares.isAuthorized(user);

        return await createOrder({ ...parameters, user });
    },

};

export const entity = {
    Order: {
        workshop: async o => await workshopModel.findOne({ _id: o.workshop }),
        event: async o => (await workshopModel.findOne({ _id: o.workshop })).getEventById(o.event),
        timestamp: o => new Date(o.createdAt).toISOString()
    }
};