import Jwt from 'jsonwebtoken';

export class UtilsTokenAuth {
  public static async jwtGenerate(userPayload: {
    id: string;
    name: string | null;
    email: string;
    password?: string;
  }) {
    const payload = userPayload;
    delete payload.password;

    const accessToken = Jwt.sign({ payload }, '34i534i6624j543546grg', {
      expiresIn: '15m',
    });

    const refreshToken = Jwt.sign(
      { payload: { id: payload.id } },
      '34i534i6624j543546grg',
    );

    return { accessToken, refreshToken };
  }
}
