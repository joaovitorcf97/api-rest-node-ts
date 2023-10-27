import { Router } from 'express';
import { MiddlewareAuth } from '../../middleware/auth-middleware';
import { userController } from './controller/user-controlle';

const router = Router();
const baseURL = '/user';

router.post(`${baseURL}`, userController.create);
router.use(`${baseURL}/:id`, MiddlewareAuth.authenticate);
router.get(`${baseURL}/:id`, userController.read);
router.patch(`${baseURL}/:id`, userController.update);
router.delete(`${baseURL}/:id`, userController.delete);

export const userRouter = router;
