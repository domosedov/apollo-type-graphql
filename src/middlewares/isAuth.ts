import {MiddlewareFn} from "type-graphql";
import {MyContext} from "../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context}, next) => {
    if (!context.req.session!.userId) {
        throw new Error('Вы не авторизованы!')
    }

    return next();
};