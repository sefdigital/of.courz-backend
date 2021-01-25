import {
    entities as workshopEntities,
    mutations as workshopMutations,
    queries as workshopQueries
} from "./entities/workshops";
import {
    entity as paymentEntities,
    mutations as paymentMutations,
    queries as paymentQueries
} from "./entities/payments";
import {
    entities as ratingsEntities,
    mutations as ratingMutations,
    queries as ratingQueries
} from "./entities/ratings";
import { entities as userEntities, mutations as userMutations, queries as userQueries } from "./entities/user";
import { DateResolver, DateTimeResolver, URLResolver } from "graphql-scalars";
import GraphQLObjectId from "graphql-scalar-objectid";

export const resolvers = {
    Query: {
        ...workshopQueries,
        ...ratingQueries,
        ...paymentQueries,
        ...userQueries
    },
    Mutation: {
        ...workshopMutations,
        ...paymentMutations,
        ...ratingMutations,
        ...userMutations
    },
    ...workshopEntities,
    ...userEntities,
    ...paymentEntities,
    ...ratingsEntities,

    Date: DateResolver,
    URL: URLResolver,
    ObjectId: GraphQLObjectId,
    DateTime: DateTimeResolver
};