import {v4 as uuid} from 'uuid'
import {redis} from "../redis";

export const createConfirmationUrl = (userId: number) => {
    const id = uuid();

    redis.set(id, userId, "ex", 60*60*24) // 1 day expiration

    return id;
}