import { Request, Response } from 'express';
import * as propertyService from '../services/property.service';
import { PropertyFilters } from '../types/property.types';
import { sendSuccess, sendError } from '../utils/response';

export async function createProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const property = await propertyService.createProperty(req.body, req.user.userId);
    sendSuccess(res, property, 'Property created', 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Creation failed';
    sendError(res, msg, 400);
  }
}

export async function getProperty(req: Request, res: Response): Promise<void> {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    if (!property) {
      sendError(res, 'Property not found', 404);
      return;
    }
    sendSuccess(res, property);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch property';
    sendError(res, msg, 400);
  }
}

export async function searchProperties(req: Request, res: Response): Promise<void> {
  try {
    const filters: PropertyFilters = {
      city: req.query.city as string | undefined,
      type: req.query.type as any,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
      maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
      lat: req.query.lat ? Number(req.query.lat) : undefined,
      lng: req.query.lng ? Number(req.query.lng) : undefined,
      radius: req.query.radius ? Number(req.query.radius) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      sort: req.query.sort as string | undefined,
    };

    const result = await propertyService.searchProperties(filters);
    sendSuccess(res, result.data, 'Properties fetched', 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Search failed';
    sendError(res, msg, 400);
  }
}

export async function updateProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const property = await propertyService.updateProperty(req.params.id, req.user.userId, req.body);
    if (!property) {
      sendError(res, 'Property not found', 404);
      return;
    }
    sendSuccess(res, property);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    sendError(res, msg, err instanceof Error && msg === 'Unauthorized' ? 403 : 400);
  }
}

export async function deleteProperty(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    await propertyService.deleteProperty(req.params.id, req.user.userId);
    sendSuccess(res, null, 'Property deleted');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Deletion failed';
    sendError(res, msg, msg === 'Unauthorized' ? 403 : 400);
  }
}
