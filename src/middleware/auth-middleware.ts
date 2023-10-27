import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { StatusErrorsEnum } from '../enum/status.enum';
import { ZodEnum } from '../enum/zod.enum';

export class MiddlewareAuth {
  public static async authenticate(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const token = request.headers['authorization'] || '';

    try {
      const ZauthSchema = z.string().min(25, {
        message: `Token ${ZodEnum.REQUIRED}`,
      });
    } catch (error: any) {
      return response.json(400).json({
        message: StatusErrorsEnum.E400,
        errors: error.erros,
      });
    }

    try {
      await jwt.verify(token, `${process.env.JWT_SECRET}`);
    } catch (error: any) {
      return response.status(401).json({
        error: StatusErrorsEnum.E401,
      });
    }

    const paramsID = request.params.id;
    const decoded = (
      (await jwt.decode(token)) as {
        payload: { id: string };
      }
    ).payload;

    if (paramsID && paramsID !== decoded.id) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
      });
    }

    next();
  }
}
