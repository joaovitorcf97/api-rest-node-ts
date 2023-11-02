import { Router } from 'express';
import multer from 'multer';
import { middlewareUpload } from '../../middleware/upload-middleware';
import { MiddlewareAuth } from '../../middleware/auth-middleware';
import { userClientFilesController } from './controller/user-client-files-controller';

const router = Router();
const baseURL = '/user-client-files';

router.use(`${baseURL}`, MiddlewareAuth.authenticate);
router.post(
  `${baseURL}/:id`,
  multer(middlewareUpload.getConfig()).single('file'),
  userClientFilesController.create,
);
router.get(`${baseURL}`, userClientFilesController.listAll);
router.get(`${baseURL}/:id`, userClientFilesController.read);
router.patch(`${baseURL}/:id`, userClientFilesController.update);
router.delete(`${baseURL}/:id`, userClientFilesController.delete);

export const userClientFilesRouter = router;
