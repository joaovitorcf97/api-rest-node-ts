import { Request, Response } from 'express';
import { z } from 'zod';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { ZodEnum } from '../../../enum/zod.enum';
import { authService } from '../service/auth-service';

class AuthController {
  public async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const ZUserSchema = z.object({
        email: z.string().email({ message: `Email ${ZodEnum.REQUIRED}` }),
        password: z.string().min(1, { message: `Senha ${ZodEnum.REQUIRED}` }),
      });

      ZUserSchema.parse({ email, password });
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        data: await authService.login(email, password),
      });
    } catch (error: any) {
      switch (error.message) {
        case StatusErrorsEnum.E401:
          return response.status(401).json({
            message: error.message,
          });

        case StatusErrorsEnum.E404:
          return response.status(404).json({
            message: error.message,
          });
      }
    }
  }

  public async token(request: Request, response: Response) {
    const token = request.headers['authorization'] || '';

    try {
      const ZAuthSchema = z
        .string()
        .min(25, { message: `${ZodEnum.REQUIRED}` });

      ZAuthSchema.parse(token);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        data: await authService.token(token),
      });
    } catch (error: any) {
      switch (error.message) {
        case StatusErrorsEnum.E401:
          return response.status(401).json({
            message: error.message,
          });

        case StatusErrorsEnum.E404:
          return response.status(404).json({
            message: error.message,
          });
      }
    }
  }
}

export const authController = new AuthController();
