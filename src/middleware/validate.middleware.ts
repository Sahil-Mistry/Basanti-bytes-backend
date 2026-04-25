import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const message = (result.error as ZodError).errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      sendError(res, message, 422);
      return;
    }
    req[part] = result.data;
    next();
  };
}
