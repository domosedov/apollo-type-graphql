import "reflect-metadata";
import "dotenv-safe/config";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {createConnection} from "typeorm";
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"

import {createSchema} from "./utils/createSchema";
import {graphqlUploadExpress} from "graphql-upload";
import path from "path";
import {User} from "./entities/User";
import {__prod__, COOKIE_NAME} from "./constants";
import Redis from "ioredis";

const main = async () => {
    await createConnection({
        name: "default",
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [User]
    });

    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    const port = process.env.PORT;
    const schema = await createSchema();

    if (app.get('env') === 'production') {
        app.set("trust proxy", 1);
    }

    app.use(express.static(path.join(__dirname, 'public')));

    app.use(cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN
    }))

    const sessionOption: session.SessionOptions = {
        name: COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
            host: "localhost",
            port: 6379
        }),
        cookie: {
            httpOnly: true,
            secure: __prod__,
            domain: __prod__ ? "domosedov-dev.info" : undefined,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false
    };

    app.use(session(sessionOption));

    app.use(graphqlUploadExpress({
        maxFiles: 5,
        maxFileSize: 10000000
    }))

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res, redis}),
        introspection: true,
        uploads: false
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(parseInt(port), () => {
        console.log(`server started on http://localhost:${port}/graphql`);
    });

    console.log(path.join(__dirname, 'public', 'uploads'))
    console.dir(process.env.NODE_ENV)
    console.log(__prod__)
    console.log(process.env.CORS_ORIGIN)
    console.log(process.env.SESSION_SECRET)
    console.log(process.env.REDIS_URL)
    console.log(app.get('env'))
};

main().catch(err => console.error(err));
