import { Router } from 'express';
import { userController } from './controller/user-controlle';

const router = Router();
const baseURL = '/user';

router.post(`${baseURL}`, userController.create);
router.get(`${baseURL}/:id`, userController.read);
router.patch(`${baseURL}/:id`, userController.update);
router.delete(`${baseURL}/:id`, userController.delete);

export const userRouter = router;
