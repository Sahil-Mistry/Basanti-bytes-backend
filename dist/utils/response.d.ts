import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: Record<string, unknown>): void;
export declare function sendError(res: Response, message: string, statusCode?: number, data?: unknown): void;
//# sourceMappingURL=response.d.ts.map