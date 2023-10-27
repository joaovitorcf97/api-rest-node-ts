import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { prismaConnnect } from '../../../prismaConn';
import { UtilsTokenAuth } from '../utils/token-utils';

class AuthService {
  public async login(email: string, password: string) {
    const findUser = await prismaConnnect.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!findUser) {
      throw new Error(StatusErrorsEnum.E404);
    }

    if (!bcrypt.compareSync(password, findUser.password)) {
      throw new Error(StatusErrorsEnum.E401);
    }

    return UtilsTokenAuth.jwtGenerate(findUser);
  }

  public async token(refresherToken: string) {
    try {
      await jwt.verify(
        refresherToken,
        `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
      );
    } catch (error: any) {
      throw new Error(StatusErrorsEnum.E401);
    }

    const decode = (
      (await jwt.decode(refresherToken)) as {
        payload: { id: string };
      }
    ).payload;

    const findUser = await prismaConnnect.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!findUser) {
      throw new Error(StatusErrorsEnum.E404);
    }

    return UtilsTokenAuth.jwtGenerate(findUser);
  }
}

export const authService = new AuthService();
