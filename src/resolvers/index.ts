import {RegisterResolver} from "./user/register/Register"
import {LoginResolver} from "./user/login/Login"
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {MeResolver} from "./user/me/Me";

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [RegisterResolver, LoginResolver, MeResolver];

export default resolvers;