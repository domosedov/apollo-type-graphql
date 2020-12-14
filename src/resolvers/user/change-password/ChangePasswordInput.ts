import {Field, InputType} from "type-graphql";
import {MinLength} from "class-validator";

@InputType()
export class ChangePasswordInput {
    @Field()
    token: string

    @Field()
    @MinLength(1)
    password: string
}