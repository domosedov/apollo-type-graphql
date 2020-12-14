import {Field, InputType} from "type-graphql";
import {PasswordMixin} from "./PasswordMixin";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
    @Field()
    token: string
}