import { createOrder } from "../../logic/orders/createOrder";
import * as middlewares from "../middlewares";
import { orderModel } from "../../models/order";

export const queries = {
    getOrderDetails: async (parent, { id }, { user }) => {
        middlewares.isAuthorized(user);

        let order = await orderModel.findOne({ order: id, user: user.user_id });

        if (!order) throw new Error("No order with specified id");

        order = await order.populate("workshop").execPopulate();
        order = { ...order.toJSON(), event: order.workshop.getEventById(order.event.toString()) };

        console.log(order);

        return order;
    }
};

export const mutations = {

    createOrder: async (parent, parameters, { user }) => {
        middlewares.isAuthorized(user);

        return await createOrder({ ...parameters, user });
    },

};