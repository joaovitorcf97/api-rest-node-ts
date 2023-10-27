import { StatusErrorsEnum } from '../../../enum/status.enum';
import { prismaConnnect } from '../../../prismaConn';

class ResetPasswordService {
  public async validateUser(email: string) {
    const findUser = await prismaConnnect.user.findUnique({
      where: { email },
      include: { reset_password_secret: true },
    });

    if (!findUser) {
      throw new Error(StatusErrorsEnum.E404);
    }

    if (!findUser.reset_password_secret) {
      const generateSecret = Number(
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join(''),
      );

      const { secret } = await prismaConnnect.resetPasswordSecret.create({
        data: {
          secret: generateSecret,
          userId: findUser.id,
        },
        select: {
          secret: true,
        },
      });

      return { email, secret };
    }

    return { email, secret: findUser.reset_password_secret.secret };
  }

  public async validateSecurityCode() {}

  public async resetPassword() {}
}

export const resetPasswordService = new ResetPasswordService();
