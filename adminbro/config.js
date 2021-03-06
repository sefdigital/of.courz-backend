import AdminBro from "admin-bro";
import AdminBroMongoose from "@admin-bro/mongoose";
import { workshopModel } from "../models/workshop";
import { ratingModel } from "../models/rating";
import { orderModel, paymentStatusCodes } from "../models/order";
import { userDetailModel } from "../models/user-detail";
import { categoryModel } from "../models/category";
import fetch from "node-fetch";
import * as functions from "firebase-functions";

AdminBro.registerAdapter(AdminBroMongoose);

const contentNavigation = {
    name: "Alles zu Workshops",
};

const orderNavigation = {
    name: "Alles zu Bestellungen"
};

const userNavigation = {
    name: "Alles zu Usern"
};

export const AdminBroOptions = {
    resources: [
        {
            resource: workshopModel, options: {
                navigation: contentNavigation,
                listProperties: ["_id", "title", "organizer", "events"],
                properties: {
                    organizer: {
                        reference: "user-detail"
                    }
                }
            }
        },
        { resource: categoryModel, options: { navigation: contentNavigation } },
        {
            resource: ratingModel, options: {
                navigation: contentNavigation,
                listProperties: ["workshop", "author", "text"],
                properties: {
                    author: {
                        reference: "user-detail"
                    }
                }
            },
        },
        {
            resource: orderModel,
            options: {
                navigation: orderNavigation,
                listProperties: ["_id", "workshop", "price", "status", "affiliate"],
                properties: {
                    user: {
                        reference: "user-detail"
                    }
                },
                actions: {
                    statistics: {
                        actionType: "resource",
                        handler: async (request, response) => {
                            const countLastDay = await orderModel.count({ createdAt: { $gte: Date.now() - 1000 * 60 * 60 * 24 } });
                            const countLastDayPayed = await orderModel.count({
                                createdAt: { $gte: Date.now() - 1000 * 60 * 60 * 24 },
                                status: paymentStatusCodes.PAYED
                            });
                            const countAll = await orderModel.count();
                            response.status(200).json({
                                count: {
                                    all: countAll,
                                    lastDay: countLastDay,
                                    lastDayPayed: countLastDayPayed
                                }
                            });
                        },
                    },
                }
            }
        },
        {
            resource: userDetailModel, options: {
                navigation: userNavigation,
                listProperties: ["_id", "email", "firstName", "lastName", "organizer", "occupation"],
                editProperties: ["_id", "email", "firstName", "lastName", "organizer", "profilePicture", "contact.whatsapp", "contact.messenger", "occupation", "birthday"],
                properties: {
                    profilePicture: {
                        components: {
                            show: AdminBro.bundle("./profile-picture-component")
                        }
                    }
                },
                actions: {
                    statistics: {
                        actionType: "resource",
                        handler: async (request, response) => {
                            const countLastDay = await userDetailModel.count({ createdAt: { $gte: Date.now() - 1000 * 60 * 60 * 24 } });
                            const countAll = await userDetailModel.count();
                            response.status(200).json({ count: { all: countAll, lastDay: countLastDay } });
                        },
                    },
                }
            }
        },
    ],
    databases: [],
    rootPath: "/",
    dashboard: {
        handler: async () => {
            const response = await fetch(`https://plausible.io/api/v1/stats/aggregate?site_id=${"of.courz.de"}&period=day&metrics=visitors,pageviews`,
                    { headers: { "Authorization": `Bearer ${functions.config().plausible.apikey}` } }),
                json = await response.json();
            console.log(json);
            return json;
        },
        component: AdminBro.bundle("./my-dashboard-component")
    },
    branding: {
        companyName: "of.courz"
    }
};