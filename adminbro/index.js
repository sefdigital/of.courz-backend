import { buildHandler } from "@admin-bro/firebase-functions";
import { AdminBroOptions } from "./config";

export const adminBroHandler = buildHandler(AdminBroOptions, {
    auth: {
        secret: process.env.PAYPAL_CLIENT_ID,
        authenticate: (email, password) => {
            return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
        }
    }
});