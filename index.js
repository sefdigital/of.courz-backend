import { readFileSync } from "fs";
import { resolvers } from "./graphql/entities/index";
import { connect } from "./models";
import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";
import { ApolloServer } from "apollo-server-cloud-functions";
import { handleWebhook } from "./paypal/webhooks.js";
import util from "util";

admin.initializeApp();

const region = 'europe-west3'; // Frankfurt 
const europeFunction = functions.region(region);

console.logFull = input => console.log(util.inspect(input, { showHidden: false, depth: null }));

const typeDefs = readFileSync("graphql/schema.graphql", "utf8");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {

        const token = (req.headers.authorization || '').replace("Bearer ", "");

        if (token) {
            try {
                const user = await admin.auth().verifyIdToken(token);
                return { user }
            } catch (e) { }
        }

    },
});

const handler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
});

connect();

export const api = europeFunction.https.onRequest(handler);

export const paypal = europeFunction.https.onRequest(handleWebhook)