import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import { sendError } from '../utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    sendError(res, message, 422);
    return;
  }

  if (err instanceof JsonWebTokenError) {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    sendError(res, `${field} already exists`, 409);
    return;
  }

  sendError(res, err.message ?? 'Internal server error', 500);
}
