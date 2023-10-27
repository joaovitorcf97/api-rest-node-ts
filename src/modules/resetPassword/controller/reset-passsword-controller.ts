import { Request, Response } from 'express';

class ResetPasswordController {
  public async validateUser(request: Request, response: Response) {}

  public async validateSecurityCode(request: Request, response: Response) {}

  public async resetPassword(request: Request, response: Response) {}
}

export const resetPasswordController = new ResetPasswordController();
