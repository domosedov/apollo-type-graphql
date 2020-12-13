import {Field, InputType} from "type-graphql";
import {IsEmail, Length, MinLength} from "class-validator";
import {IsEmailAlreadyExist} from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {

    @Field()
    @Length(1, 255)
    firstName: string

    @Field()
    @Length(1, 255)
    lastName: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({
        message: "Этот email уже используется"
    })
    email: string

    @Field()
    @MinLength(1)
    password: string
}