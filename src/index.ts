import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {buildSchema} from "type-graphql";
import {createConnection} from "typeorm";
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"

import {redis} from "./redis";
import resolvers from './resolvers'

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({req}) => ({req})
    });

    const app = express();
    const RedisStore = connectRedis(session);

    app.use(cors({
        credentials: true,
        origin: "*"
    }))

    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: redis,
        }),
        name: "qid",
        secret: "SECRET" || "",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
    };

    app.use(session(sessionOption));

    apolloServer.applyMiddleware({app});

    app.listen(8080, () => {
        console.log("server started on http://localhost:8080/graphql");
    });
};

main().catch(err => console.error(err));
