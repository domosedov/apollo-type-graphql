import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import bcrypt from "bcryptjs";

import {User} from "../../../entities/User";
import {RegisterInput} from "./RegisterInput";
import {isAuth} from "../../../middlewares/isAuth";
import {createConfirmationUrl} from "../../../utils/createConfirmationUrl";
import {sendEmail} from "../../../utils/sendEmail";
import {MyContext} from "../../../types/MyContext";

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth)
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Mutation(() => User)
    async register(
        @Ctx() ctx: MyContext,
        @Arg("data") {email, firstName, lastName, password}: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();

        await sendEmail(email, await createConfirmationUrl(user.id));

        ctx.req.session.userId = user.id;

        return user;
    }
}
