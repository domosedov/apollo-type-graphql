import {RegisterResolver} from "./user/register/Register"
import {LoginResolver} from "./user/login/Login"
import {MeResolver} from "./user/me/Me";
import {ConfirmUserResolver} from "./user/register/ConfirmUser";
import {ForgotPasswordResolver} from "./user/forgot-password/ForgotPassword";
import {ChangePasswordResolver} from "./user/change-password/ChangePassword";
import {LogoutResolver} from "./user/logout/Logout";
import {CreateJopaResolver} from "./user/CreateUser";
import {UploadAvatarResolver} from "./user/upload-avatar/UploadAvatar";
import { TodoResolver } from "./todo/Todo";
import { GetUserResolver } from "./user/GetUserResolver";

const resolvers = [RegisterResolver, LoginResolver, LogoutResolver, MeResolver, ConfirmUserResolver, ForgotPasswordResolver, ChangePasswordResolver, CreateJopaResolver, UploadAvatarResolver, TodoResolver, GetUserResolver] as const;

export default resolvers;