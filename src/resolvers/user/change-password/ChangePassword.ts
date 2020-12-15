import {
    Resolver,
    Mutation,
    Arg, Ctx
} from "type-graphql";
import bcrypt from "bcryptjs";
import {User} from "../../../entities/User";
import {forgotPasswordPrefix} from "../../../constants/redis-prefixes";
import {ChangePasswordInput} from "../../../inputs/ChangePasswordInput";
import {MyContext} from "../../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, {nullable: true})
    async changePassword(
        @Arg("data") {token, password}: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {

        const userId = await ctx.redis.get(forgotPasswordPrefix + token);

        console.log(userId)

        if (!userId) return null;

        const user = await User.findOne({where: {id: userId}})

        if (!user) return null;

        await ctx.redis.del(forgotPasswordPrefix + token);

        user.password = await bcrypt.hash(password, 12);

        await user.save();

        return user;
    }
}
