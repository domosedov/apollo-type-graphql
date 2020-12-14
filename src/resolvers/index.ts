import {RegisterResolver} from "./user/register/Register"
import {LoginResolver} from "./user/login/Login"
import {MeResolver} from "./user/me/Me";
import {ConfirmUserResolver} from "./user/register/ConfirmUser";
import {ForgotPasswordResolver} from "./user/forgot-password/ForgotPassword";
import {ChangePasswordResolver} from "./user/change-password/ChangePassword";

const resolvers = [RegisterResolver, LoginResolver, MeResolver, ConfirmUserResolver, ForgotPasswordResolver, ChangePasswordResolver] as const;

export default resolvers;