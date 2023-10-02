import { Router } from 'express';
import { authController } from './controller/auth-controller';

const router = Router();
const baseURL = '/auth';

router.post(`${baseURL}/login`, authController.login);
router.post(`${baseURL}/token`, authController.token);

export const authRouter = router;
