import {Ctx, Query, Resolver} from "type-graphql";

import {User} from "../../../entities/User";
import {MyContext} from "../../../types/MyContext";

@Resolver()
export class MeResolver {
    @Query(() => User, {nullable: true,})
    async me(
        @Ctx() ctx: MyContext
    ): Promise<User | undefined> {

        if (!ctx.req.session!.userId) {
            return undefined;
        }

        const id = ctx.req.session.userId;

        return await User.findOne({where: {id}});
    }

}
