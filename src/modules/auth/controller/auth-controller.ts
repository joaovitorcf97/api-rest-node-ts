import { Request, Response } from 'express';
import { z } from 'zod';

class AuthController {
  public async login(reqquest: Request, response: Response) {}
  public async token(reqquest: Request, response: Response) {}
}

export const authController = new AuthController();
