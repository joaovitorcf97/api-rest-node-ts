import fs from 'node:fs';
import path from 'node:path';
import { Request, Response } from 'express';
import mime from 'mime';
import { z } from 'zod';
import { MessageEnum } from '../../../enum/message.enum';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { ZodEnum } from '../../../enum/zod.enum';
import { userClientFilesService } from '../service/user-client-files-service';

class UserClientFilesController {
  public async create(request: Request, response: Response) {
    const tokenUserId = request.tokenUserId;
    const paramsId = request.params.id;
    const { name, date, description } = request.body;
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
      });
    }

    const fileType = mime.getType(file.originalname);

    try {
      const conditions = ['png', 'jpg', 'jpeg'];

      const ZClientFileSchema = z.object({
        paramsId: z.string().min(30, { message: `UC_ID: ${ZodEnum.REQUIRED}` }),
        name: z.string().min(1, { message: `Nome ${ZodEnum.REQUIRED}` }),
        date: z.string().datetime({ message: `Nome ${ZodEnum.REQUIRED}` }),
        file: z
          .any()
          .refine(() => conditions.some((ext) => fileType?.includes(ext)), {
            message: `Upload aceita apenas: ${conditions}`,
          }),
      });

      ZClientFileSchema.parse({ paramsId, name, date, file });
    } catch (error: any) {
      const fileURl = ['assets', 'files', tokenUserId, paramsId];

      if (fs.existsSync(path.resolve(...fileURl))) {
        fs.rmSync(path.resolve(...fileURl, file.filename));
      }

      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.CREATE,
        date: await userClientFilesService.create(
          paramsId,
          tokenUserId,
          name,
          date,
          file.filename,
          description,
        ),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }

  public async read(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientFileSchema = z
        .string()
        .min(30, { message: `UC_ID: ${ZodEnum.REQUIRED}` });

      ZClientFileSchema.parse(paramsId);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.READ,
        data: await userClientFilesService.read(paramsId, tokenUserId),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }

  public async listAll(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;
    const paramsYear = request.params.year;

    try {
      const ZClientFileSchema = z.object({
        paramsId: z.string().min(30, { message: `UC_ID ${ZodEnum.REQUIRED}` }),
        paramsYear: z.string().min(4, { message: `Data ${ZodEnum.REQUIRED}` }),
      });

      ZClientFileSchema.parse({ paramsId, paramsYear });
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.READ,
        data: await userClientFilesService.listAll(
          paramsId,
          paramsYear,
          tokenUserId,
        ),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }

  public async update(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    const { id, name, date, description } = request.body;
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
      });
    }

    try {
      const conditions = ['png', 'jpg', 'jpeg'];
      const fileType = mime.getType(file.originalname);

      const ZClientFileSchema = z.object({
        paramsId: z.string().min(30, { message: `UC_ID: ${ZodEnum.REQUIRED}` }),
        id: z.string().min(30, { message: `UCF_ID: ${ZodEnum.REQUIRED}` }),
        name: z.string().min(1, { message: `Nome ${ZodEnum.REQUIRED}` }),
        date: z.string().datetime({ message: `Nome ${ZodEnum.REQUIRED}` }),
        file: z
          .any()
          .refine(() => conditions.some((ext) => fileType?.includes(ext)), {
            message: `Upload aceita apenas: ${conditions}`,
          }),
      });

      ZClientFileSchema.parse({ paramsId, id, name, date, file });
    } catch (error: any) {
      const fileURl = ['assets', 'files', tokenUserId, paramsId];

      if (fs.existsSync(path.resolve(...fileURl))) {
        fs.rmSync(path.resolve(...fileURl, file.filename));
      }

      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.UPDATE,
        data: await userClientFilesService.update(
          paramsId,
          tokenUserId,
          id,
          name,
          date,
          description,
          file.filename,
        ),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }

  public async delete(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientFileSchema = z
        .string()
        .min(30, { message: `UC_ID: ${ZodEnum.REQUIRED}` });

      ZClientFileSchema.parse(paramsId);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      await userClientFilesService.delete(paramsId, tokenUserId);
      return response.json({
        message: MessageEnum.DELETE,
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
      });
    }
  }
}

export const userClientFilesController = new UserClientFilesController();
