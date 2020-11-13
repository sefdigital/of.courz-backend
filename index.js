import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { readFileSync } from "fs";
import { resolvers } from "./resolver.js";
import playground from "graphql-playground-middleware-express";
import {connect} from "./database";
require('dotenv').config()

console.log(playground);

const typeDefs = readFileSync("schema.graphql", "utf8");

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: false
}));

connect();

app.get("/playground", playground({ endpoint: "/graphql" }));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));