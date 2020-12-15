import { entities as workshopEntities, mutations as workshopMutations, queries as workshopQueries } from "./entities/workshops";
import { queries as paymentQueries, mutations as paymentMutations, entity as paymentEntities } from "./entities/payments";
import { mutations as ratingMutations, queries as ratingQueries } from "./entities/ratings";
import { queries as userQueries, mutations as userMutations, entities as userEntities } from "./entities/user";
import { DateResolver, URLResolver } from "graphql-scalars";

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

    Date: DateResolver,
    URL: URLResolver
};