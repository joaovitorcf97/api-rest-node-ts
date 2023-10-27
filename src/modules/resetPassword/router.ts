import { Router } from 'express';
import { resetPasswordController } from './controller/reset-passsword-controller';

const router = Router();
const baseURL = '/reset-password';

router.post(`${baseURL}`, resetPasswordController.validateUser);
router.post(
  `${baseURL}/validate`,
  resetPasswordController.validateSecurityCode,
);
router.patch(`${baseURL}`, resetPasswordController.resetPassword);

export const resetPasswordRouter = router;
