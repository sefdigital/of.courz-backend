import { mutations as workshopMutations, queries as workshopQueries } from "./entities/workshops";

export const resolvers = {
    Query: {
        ...workshopQueries
    },
    Mutation: {
        ...workshopMutations
    }
}