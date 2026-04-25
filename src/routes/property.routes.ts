import { Router } from 'express';
import { z } from 'zod';
import * as propertyController from '../controllers/property.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const CreatePropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial', 'house']),
  price: z.number().positive(),
  area: z.number().positive(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    country: z.string().min(1),
  }),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

const UpdatePropertySchema = CreatePropertySchema.partial();

// Public routes
router.get('/', propertyController.searchProperties);
router.get('/:id', propertyController.getProperty);

// Protected routes
router.post('/', verifyJWT(), validate(CreatePropertySchema), propertyController.createProperty);
router.put('/:id', verifyJWT(), validate(UpdatePropertySchema), propertyController.updateProperty);
router.delete('/:id', verifyJWT(), propertyController.deleteProperty);

export default router;
