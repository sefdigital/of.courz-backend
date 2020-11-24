import { entities as workshopEntites, mutations as workshopMutations, queries as workshopQueries } from "./workshops";
import { mutations as paymentMutations } from "./payments";
import { mutations as ratingMutations, queries as ratingQueries } from "./ratings";

export const resolvers = {
    Query: {
        ...workshopQueries,
        ...ratingQueries,
    },
    Mutation: {
        ...workshopMutations,
        ...paymentMutations,
        ...ratingMutations
    },
    ...workshopEntites
}