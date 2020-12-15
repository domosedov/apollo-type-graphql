import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {createConnection} from "typeorm";
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"

import {redis} from "./redis";
import {createSchema} from "./utils/createSchema";
import {graphqlUploadExpress} from "graphql-upload";
import path from "path";

const main = async () => {
    await createConnection();

    const schema = await createSchema();

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res}),
        introspection: true,
        uploads: false
    });

    const app = express();
    const RedisStore = connectRedis(session);

    app.use(express.static(path.join(__dirname, 'public')));

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

    app.use(graphqlUploadExpress({
        maxFiles: 5,
        maxFileSize: 10000000
    }))

    apolloServer.applyMiddleware({app});

    app.listen(8080, () => {
        console.log("server started on http://localhost:8080/graphql");
    });

    console.log(path.join(__dirname, 'public', 'uploads'))
};

main().catch(err => console.error(err));
