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

    const accessToken = Jwt.sign({ payload }, `${process.env.JWT_SECRET}`, {
      expiresIn: `${process.env.JTW_EXPIRE_IN}`,
    });

    const refreshToken = Jwt.sign(
      { payload: { id: payload.id } },
      `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
    );

    return { accessToken, refreshToken };
  }
}
