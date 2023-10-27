import { Request, Response } from 'express';
import { z } from 'zod';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { ZodEnum } from '../../../enum/zod.enum';
import { resetPasswordService } from '../service/reset-password-service';

class ResetPasswordController {
  public async validateUser(request: Request, response: Response) {
    const email = request.body.email;

    try {
      const ZUserSchema = z
        .string()
        .email({ message: `Email ${ZodEnum.REQUIRED}` });

      ZUserSchema.parse(email);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.erros,
      });
    }

    try {
      return response.json({
        message: 'Codigo enviado para o e-mail',
        data: await resetPasswordService.validateUser(email),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }

  public async validateSecurityCode(request: Request, response: Response) {}

  public async resetPassword(request: Request, response: Response) {}
}

export const resetPasswordController = new ResetPasswordController();
