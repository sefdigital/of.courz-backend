import AdminBro from "admin-bro";
import AdminBroMongoose from "@admin-bro/mongoose";
import { buildHandler } from "@admin-bro/firebase-functions";
import { workshopModel } from "../models/workshop";
import { ratingModel } from "../models/rating";
import { orderModel } from "../models/order";
import { userDetailModel } from "../models/user-detail";
import { categoryModel } from "../models/category";

AdminBro.registerAdapter(AdminBroMongoose);

const contentNavigation = {
    name: "Alles zu Workshops",
};

const AdminBroOptions = {
    resources: [
        {
            resource: workshopModel, options: {
                navigation: contentNavigation,
                listProperties: ["id", "title", "organizer", "events"]
            }
        },
        { resource: categoryModel, options: { navigation: contentNavigation } },
        {
            resource: ratingModel, options: {
                navigation: contentNavigation,
                listProperties: ["workshop", "content", "composition", "clarity", "expertise", "goalAchievement", "text"]
            }
        },
        { resource: orderModel,
            options: {
                navigation: contentNavigation,
                listProperties: ["_id", "workshop", "price", "status", "affiliate"]
            }
        },
        { resource: userDetailModel, options: { navigation: contentNavigation } },
    ],
    databases: [],
    rootPath: "/",
    branding: {
        companyName: "SEF Workshops"
    }
};

export const adminBroHandler = buildHandler(AdminBroOptions, {
    auth: {
        secret: process.env.PAYPAL_CLIENT_ID,
        authenticate: (email, password) => {
            return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
        }
    }
});