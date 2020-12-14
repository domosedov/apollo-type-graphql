import {Request, Response} from "express"
import {Session} from "express-session"
import { Redis } from "ioredis";

export interface MyContext {
    req: Request & { session: Session & {userId?: string | number } }
    res: Response
    redis: Redis
}