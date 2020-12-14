import {InputType, ClassType, Field} from 'type-graphql'
import {MinLength} from "class-validator";

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
    @InputType()
    class PasswordInput extends BaseClass {
        @Field()
        @MinLength(1)
        password: string
    }

    return PasswordInput
}