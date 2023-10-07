import bcrypt from 'bcrypt';
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

  public async token() {}
}

export const authService = new AuthService();
