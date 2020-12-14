import {v4 as uuid} from 'uuid'
import {redis} from "../redis";
import {confirmUserPrefix} from "../constants/redis-prefixes";

export const createConfirmationUrl = async (userId: number) => {

    const token = uuid();

    await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24) // 1 day expiration

    return `http://localhost:3000/user/confirm/${token}`;
}