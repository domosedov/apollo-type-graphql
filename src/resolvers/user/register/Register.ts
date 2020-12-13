import {Arg, Mutation, Query, Resolver} from "type-graphql";
import bcrypt from "bcryptjs";

import {User} from "../../../entities/User";
import {RegisterInput} from "./RegisterInput";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") {email, firstName, lastName, password}: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    return await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
  }
}
