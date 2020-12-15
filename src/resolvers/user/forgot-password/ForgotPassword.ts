import {
    Resolver,
    Mutation,
    Arg, Ctx
} from "type-graphql";

import {User} from "../../../entities/User";
import {sendEmail} from "../../../utils/sendEmail";
import {v4 as uuid} from "uuid";
import {forgotPasswordPrefix} from "../../../constants/redis-prefixes";
import {MyContext} from "../../../types/MyContext";

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() ctx: MyContext
    ): Promise<boolean> {

        const user = await User.findOne({where: {email}});

        if (!user) return true;

        const token = uuid();

        await ctx.redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24) // 1 day expiration

        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`);

        return true;
    }
}
