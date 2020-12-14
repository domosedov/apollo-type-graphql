import {Field, InputType} from "type-graphql";
import {IsEmail, Length} from "class-validator";
import {IsEmailAlreadyExist} from "../validators/isEmailAlreadyExist";
import {PasswordMixin} from "./PasswordMixin";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {

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
}