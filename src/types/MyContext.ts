import {Request} from "express"
import {Session} from "express-session"
import { Redis } from "ioredis";

export interface MyContext {
    req: Request & { session: Session & {userId?: string | number } }
    redis: Redis
}