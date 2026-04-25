import { Router } from 'express';
import { z } from 'zod';
import * as propertyController from '../controllers/property.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const CreatePropertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  city: z.string().min(1),
  price: z.number().positive(),
  price_per_sqft: z.number().positive(),
  area_sqft: z.number().positive(),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial', 'house', 'Builder Floor']),
  bedrooms: z.number().nonnegative(),
  bathrooms: z.number().nonnegative(),
  furnishing: z.enum(['Unfurnished', 'Semi-Furnished', 'Furnished']),
  age: z.number().nonnegative(),
  latitude: z.number(),
  longitude: z.number(),
  investment_score: z.number().min(0).max(100),
  rental_yield: z.number().nonnegative(),
  risk_level: z.enum(['Low', 'Medium', 'High']),
  location_coords: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
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
