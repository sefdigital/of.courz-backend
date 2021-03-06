import { buildHandler } from "@admin-bro/firebase-functions";
import { AdminBroOptions } from "./config";
import * as functions from "firebase-functions";

export const adminBroHandler = buildHandler(AdminBroOptions, {
    auth: {
        secret: functions.config().database.url,
        authenticate: (email, password) => {
            return email === functions.config().adminbro.adminemail && password === functions.config().adminbro.adminpassword;
        }
    }
});