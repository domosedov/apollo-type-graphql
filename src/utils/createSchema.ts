import {buildSchema} from "type-graphql";
import resolvers from "../resolvers";

export const createSchema = () => buildSchema({
    resolvers,
    authChecker: ({context: {req}}) => {
        return !!req.session!.userId;
    },
    validate: false
})