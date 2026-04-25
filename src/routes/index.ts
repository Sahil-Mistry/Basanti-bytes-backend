import { Router } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import uploadRoutes from './upload.routes';
import localityRoutes from './locality.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/upload', uploadRoutes);
router.use('/locality', localityRoutes);

export default router;
