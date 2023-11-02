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
        message: error.errors,
      });
    }
  }

  public async read(reqquest: Request, response: Response) {}

  public async listAll(reqquest: Request, response: Response) {}

  public async update(reqquest: Request, response: Response) {}

  public async delete(reqquest: Request, response: Response) {}
}

export const userClientFilesController = new UserClientFilesController();
