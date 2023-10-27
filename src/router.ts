import { authRouter } from './modules/auth/router';
import { resetPasswordRouter } from './modules/resetPassword/router';
import { userRouter } from './modules/user/router';

export const router = [authRouter, userRouter, resetPasswordRouter];
