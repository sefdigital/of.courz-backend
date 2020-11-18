import { entities as workshopEntites, mutations as workshopMutations, queries as workshopQueries } from "./entities/workshops";
import { mutations as paymentMutations } from "./entities/payments";

export const resolvers = {
    Query: {
        ...workshopQueries
    },
    Mutation: {
        ...workshopMutations,
        ...paymentMutations
    },
    ...workshopEntites
}