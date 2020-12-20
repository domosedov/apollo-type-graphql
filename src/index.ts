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
import { Todo } from "./entities/Todo";

const main = async () => {
    await createConnection({
        name: "default",
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        dropSchema: true,
        entities: [User, Todo]
    });

    const user1 = await User.create({
        firstName: "Alex",
        lastName: "Grig",
        email: "domosed0",
        password: "2001"
    }).save()

    const user2 = await User.create({
      firstName: "Sonya",
      lastName: "Grig",
      email: "domosed1",
      password: "2001",
    }).save();

    const user3 = await User.create({
      firstName: "Vlad",
      lastName: "Grig",
      email: "domosed2",
      password: "2001",
    }).save();

    console.log(user1)

    await Todo.create({
        title: 'todo 1',
        description: 'desc 1',
        user: {
            id: 1
        }
    }).save();

    await Todo.create({
      title: "todo 2",
      description: "desc 1",
      user: {
        id: 1,
      },
    }).save();

    await Todo.create({
      title: "todo 3",
      description: "desc 1",
      user: {
        id: 2,
      },
    }).save();

    await Todo.create({
      title: "todo 4",
      description: "desc 1",
      user: {
        id: 3,
      },
    }).save();

    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    const port = process.env.PORT;
    const schema = await createSchema();

    if (__prod__) {
        app.set("trust proxy", 1);
    }

    app.use(express.static(path.join(__dirname, 'public')));

    app.use(cors({
        credentials: true,
        origin: __prod__ ?  process.env.CORS_ORIGIN : "*"
    }))

    app.use(session(
        {
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                httpOnly: true,
                secure: __prod__,
                domain: __prod__ ? "domosedov-dev.info" : undefined,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24,
            },
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }
    ));

    app.use(graphqlUploadExpress({
        maxFiles: 5,
        maxFileSize: 10000000
    }))

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res, redis}),
        introspection: !__prod__,
        uploads: false,
    });

    app.get('/', (_, res) => {
        res.cookie('foo', 'bar', {
            httpOnly: true,
            domain: ".domosedov-dev.info",
            maxAge: 100000000
        })
        res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
    })

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(parseInt(port), () => {
        console.log(`server started on http://localhost:${port}/graphql`);
    });

};

main().catch(err => console.error(err));
