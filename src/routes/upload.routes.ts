import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/upload.controller';
import { verifyJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  '/csv',
  verifyJWT(),
  requireRole('admin'),
  upload.single('file'),
  uploadController.uploadCsv
);

export default router;
