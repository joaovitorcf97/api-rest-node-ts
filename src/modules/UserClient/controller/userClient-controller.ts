import { Request, Response } from 'express';
import { z } from 'zod';
import { MessageEnum } from '../../../enum/message.enum';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { ZodEnum } from '../../../enum/zod.enum';
import { userClientService } from '../service/userClient-service';

class UserClientController {
  public async create(request: Request, response: Response) {
    const { name, email, phone } = request.body;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientSchema = z.string().min(1, `Nome ${ZodEnum.REQUIRED}`);
      ZClientSchema.parse(name);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      console.log(tokenUserId);
      return response.json({
        message: MessageEnum.CREATE,
        data: await userClientService.create(tokenUserId, name, email, phone),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.errors,
      });
    }
  }

  public async read(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientSchema = z.string().min(30, `ID ${ZodEnum.REQUIRED}`);
      ZClientSchema.parse(paramsId);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.READ,
        data: await userClientService.read(paramsId, tokenUserId),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.errors,
      });
    }
  }

  public async listAll(request: Request, response: Response) {
    const tokenUserId = request.tokenUserId;
    let page = Number(request.query.page);
    const search = request.query.search
      ? String(request.query.search)
      : undefined;

    if (!page || page <= 0 || isNaN(page)) {
      page = 1;
    }

    try {
      return response.json({
        message: MessageEnum.READ,
        data: await userClientService.listAll(tokenUserId, page, search),
      });
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }
  }

  public async update(request: Request, response: Response) {
    const { name, email, phone } = request.body;
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientSchema = z.object({
        name: z.string().min(1, `Nome ${ZodEnum.REQUIRED}`),
        paramsId: z.string().min(30, `ID ${ZodEnum.REQUIRED}`),
      });
      ZClientSchema.parse({ name, paramsId });
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      return response.json({
        message: MessageEnum.UPDATE,
        data: await userClientService.update(
          tokenUserId,
          paramsId,
          name,
          email,
          phone,
        ),
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.errors,
      });
    }
  }

  public async delete(request: Request, response: Response) {
    const paramsId = request.params.id;
    const tokenUserId = request.tokenUserId;

    try {
      const ZClientSchema = z.string().min(30, `ID ${ZodEnum.REQUIRED}`);
      ZClientSchema.parse(paramsId);
    } catch (error: any) {
      return response.status(400).json({
        message: StatusErrorsEnum.E400,
        error: error.errors,
      });
    }

    try {
      await userClientService.delete(tokenUserId, paramsId);

      return response.json({
        message: MessageEnum.DELETE,
      });
    } catch (error: any) {
      return response.status(404).json({
        message: error.errors,
      });
    }
  }
}

export const userClientController = new UserClientController();
