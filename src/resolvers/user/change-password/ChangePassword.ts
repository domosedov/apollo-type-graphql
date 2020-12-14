import {
    Resolver,
    Mutation,
    Arg
} from "type-graphql";
import bcrypt from "bcryptjs";
import {redis} from "../../../redis";
import {User} from "../../../entities/User";
import {forgotPasswordPrefix} from "../../../constants/redis-prefixes";
import {ChangePasswordInput} from "./ChangePasswordInput";

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, {nullable: true})
    async changePassword(
        @Arg("data") {token, password}: ChangePasswordInput,
    ): Promise<User | null> {

        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) return null;

        const user = await User.findOne({where: {id: userId}})

        if (!user) return null;

        await redis.del(forgotPasswordPrefix + token);

        user.password = await bcrypt.hash(password, 12);

        await user.save();

        return user;
    }
}
