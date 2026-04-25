import { Request, Response } from 'express';
import { register as registerService, login as loginService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const { user, tokens } = await registerService(name, email, password);
    sendSuccess(res, { user, ...tokens }, 'Registered successfully', 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    sendError(res, msg, 400);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const tokens = await loginService(email, password);
    sendSuccess(res, tokens, 'Login successful');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    sendError(res, msg, 401);
  }
}
