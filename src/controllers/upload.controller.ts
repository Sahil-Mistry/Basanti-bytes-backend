import { Request, Response } from 'express';
import { parseCsvBuffer, enrichWithGeocode } from '../utils/csvParser';
import { Property } from '../models/property.model';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export async function uploadCsv(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }

    const user = req.user;
    const { inserted, failed } = await parseCsvBuffer(req.file.buffer);

    if (inserted.length > 0) {
      const enriched = await enrichWithGeocode(inserted);
      const docs = enriched.map((row) => ({
        title: row.title,
        description: row.description,
        type: row.type,
        price: row.price,
        area: row.area,
        address: {
          street: row.street,
          city: row.city,
          state: row.state,
          country: row.country,
        },
        location: row.lat && row.lng ? { type: 'Point' as const, coordinates: [row.lng, row.lat] } : undefined,
        amenities: row.amenities ? row.amenities.split(',').map((a: string) => a.trim()) : [],
        images: row.images ? row.images.split(',').map((i: string) => i.trim()) : [],
        owner: new Types.ObjectId(user.userId),
        isActive: true,
      }));

      await Property.insertMany(docs);
    }

    sendSuccess(
      res,
      { inserted: inserted.length, failed: failed.length, errors: failed },
      'CSV processed',
      200
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    sendError(res, msg, 400);
  }
}
