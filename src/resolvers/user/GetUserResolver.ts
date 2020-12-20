import { User } from "../../entities/User";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class GetUserResolver {
  @Query(() => User)
  async getUserById(@Arg('id') id: number): Promise<User | undefined> {
    return await User.findOne({where: { id }})
  }
}