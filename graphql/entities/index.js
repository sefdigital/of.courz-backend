import { entities as workshopEntities, mutations as workshopMutations, queries as workshopQueries } from "./workshops";
import { queries as paymentQueries, mutations as paymentMutations } from "./payments";
import { mutations as ratingMutations, queries as ratingQueries } from "./ratings";

export const resolvers = {
    Query: {
        ...workshopQueries,
        ...ratingQueries,
        ...paymentQueries
    },
    Mutation: {
        ...workshopMutations,
        ...paymentMutations,
        ...ratingMutations
    },
    ...workshopEntities
};