import { userClientFilesRouter } from './modules/UserClientFiles/router';
import { authRouter } from './modules/Auth/router';
import { resetPasswordRouter } from './modules/ResetPassword/router';
import { userRouter } from './modules/User/router';
import { userClientRouter } from './modules/UserClient/router';

export const router = [
  authRouter,
  userRouter,
  resetPasswordRouter,
  userClientRouter,
  userClientFilesRouter,
];
