import { Router } from 'express';
import { MiddlewareAuth } from '../../middleware/auth-middleware';
import { userClientController } from './controller/userClient-controller';

const router = Router();
const baseURL = '/user-client';

router.use(`${baseURL}`, MiddlewareAuth.authenticate);
router.post(`${baseURL}`, userClientController.create);
router.get(`${baseURL}`, userClientController.listAll);
router.get(`${baseURL}/:id`, userClientController.read);
router.patch(`${baseURL}/:id`, userClientController.update);
router.delete(`${baseURL}/:id`, userClientController.delete);

export const userClientRouter = router;
