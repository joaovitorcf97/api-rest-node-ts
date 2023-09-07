import { Request, Response } from 'express';
import { z } from 'zod';
import { userService } from '../service/user-service';
import { ZodEnum } from '../../../enum/zod.enum';
import { MessageEnum } from '../../../enum/message.enum';

class UserController {
  public async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    try {
      const zUserSchema = z.object({
        name: z.string().optional(),
        email: z.string().email({ message: `E-mail ${ZodEnum.REQUIRED}` }),
        password: z
          .string()
          .min(8, { message: 'Senha deve ter no minímo 8 caracteres' }),
      });

      zUserSchema.parse({ name, email, password });
    } catch (error) {
      return response.status(400).json({
        message: ZodEnum.INVALID_DATA,
        error: error,
      });
    }

    try {
      return response.json({
        message: MessageEnum.CREATE,
        data: await userService.create(name, email, password),
      });
    } catch (error: any) {
      return response.status(409).json({
        message: error.message,
      });
    }
  }

  public async read(request: Request, response: Response) {
    const paramsID = request.params.id;

    try {
      const ZUserSchema = z
        .string()
        .min(30, { message: `ID ${ZodEnum.REQUIRED}` });
      ZUserSchema.parse(paramsID);
    } catch (error: any) {
      return response.status(400).json({
        message: ZodEnum.INVALID_DATA,
        error: error,
      });
    }

    try {
      return response.json({
        message: MessageEnum.READ,
        data: await userService.read(paramsID),
      });
    } catch (error: any) {
      return response.status(404).json({
        error: error.message,
      });
    }
  }

  public async update(request: Request, response: Response) {
    const { name } = request.body;
    const paramsID = request.params.id;

    try {
      const zUserSchema = z.object({
        paramsID: z.string().min(30, { message: `ID ${ZodEnum.REQUIRED}` }),
        name: z.string().min(1, { message: `Nome ${ZodEnum.REQUIRED}` }),
      });

      zUserSchema.parse({ paramsID, name });
    } catch (error) {
      return response.status(400).json({
        message: ZodEnum.INVALID_DATA,
        error: error,
      });
    }

    try {
      return response.json({
        message: MessageEnum.UPDATE,
        data: await userService.update(paramsID, name),
      });
    } catch (error: any) {
      return response.status(404).json({
        error: error.message,
      });
    }
  }

  public async delete(request: Request, response: Response) {
    const paramsID = request.params.id;

    try {
      const ZUserSchema = z
        .string()
        .min(30, { message: `ID ${ZodEnum.REQUIRED}` });
      ZUserSchema.parse(paramsID);
    } catch (error: any) {
      return response.status(400).json({
        message: ZodEnum.INVALID_DATA,
        error: error,
      });
    }

    try {
      await userService.delete(paramsID);

      return response.json({
        message: MessageEnum.DELETE,
      });
    } catch (error: any) {
      return response.status(404).json({
        error: error.message,
      });
    }
  }
}

export const userController = new UserController();
