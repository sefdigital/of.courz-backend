import { readFileSync } from "fs";
import { resolvers } from "./graphql/resolver";
import { connect } from "./models";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ApolloServer } from "apollo-server-cloud-functions";
import { handleWebhook } from "./paypal/webhooks.js";
import util from "util";
import { createUserDetail, deleteUserDetails } from "./models/user-detail";
import { adminBroHandler } from "./adminbro/index";

admin.initializeApp();

export const region = "europe-west3"; // Frankfurt
const europeFunction = functions.region(region);

console.logFull = input => console.log(util.inspect(input, { showHidden: false, depth: null }));

const typeDefs = readFileSync("graphql/schema.graphql", "utf8");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {

        const token = (req.headers.authorization || "").replace("Bearer ", "");

        if (token) {
            try {
                const user = await admin.auth().verifyIdToken(token);
                return { user: { ...user, _id: user.user_id } };
            } catch (e) {
                return { user: null };
            }
        }

    },
});

export const handler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
});

connect();

export const api = europeFunction.https.onRequest(handler);
export const paypal = europeFunction.https.onRequest(handleWebhook);
export const registerUser = europeFunction.auth.user().onCreate(createUserDetail);
export const deleteUser = europeFunction.auth.user().onDelete(deleteUserDetails);
export const adminBro = europeFunction.https.onRequest(adminBroHandler);