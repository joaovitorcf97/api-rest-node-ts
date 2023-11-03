import path from 'node:path';
import fs from 'node:fs';
import moment from 'moment';
import { UtilsFileUser } from '../../../utils/file-utils';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { prismaConnnect } from '../../../prismaConn';

class UserClientFilesService {
  public async create(
    paramsId: string,
    tokenUserId: string,
    name: string,
    date: Date,
    file: string,
    description: string,
  ) {
    const findClient = await prismaConnnect.client.findUnique({
      where: { id: paramsId },
    });

    if (!findClient) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const create = await prismaConnnect.userClintFiles.create({
      data: {
        name,
        date,
        file,
        description,
        userId: tokenUserId,
        userClientId: paramsId,
      },
    });

    return create;
  }

  public async read(paramsId: string, tokenUserId: string) {
    const findUserClient = await prismaConnnect.userClintFiles.findFirst({
      where: { id: paramsId, userId: tokenUserId },
      include: { userClient: {} },
    });

    if (!findUserClient) {
      throw new Error(StatusErrorsEnum.E404);
    }

    return findUserClient;
  }

  public async listAll(
    paramsId: string,
    paramsYear: string,
    tokenUserId: string,
  ) {
    const startDate = moment(`${paramsYear}-01-01`).startOf('year').format();
    const endDate = moment(`${paramsYear}-12-31`).endOf('year').format();

    const findAll = await prismaConnnect.userClintFiles.findMany({
      where: {
        userClientId: paramsId,
        userId: tokenUserId,
        date: {
          gt: startDate,
          lt: endDate,
        },
      },
    });

    if (!findAll) {
      throw new Error(StatusErrorsEnum.E404);
    }

    return findAll;
  }

  public async update(
    paramsId: string,
    tokenUserId: string,
    id: string,
    name: string,
    date: string,
    description: string,
    file: string,
  ) {
    const find = await prismaConnnect.userClintFiles.findFirst({
      where: { id, userClientId: paramsId, userId: tokenUserId },
    });

    if (!find) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const update = await prismaConnnect.userClintFiles.update({
      where: { id, userClientId: paramsId, userId: tokenUserId },
      data: { name, date, description, file },
    });

    const fileURl = ['assets', 'files', tokenUserId, paramsId];

    if (fs.existsSync(path.resolve(...fileURl))) {
      fs.rmSync(path.resolve(...fileURl, find.file));
    }

    return update;
  }

  public async delete(paramsId: string, tokenUserId: string) {
    const find = await prismaConnnect.userClintFiles.findFirst({
      where: { id: paramsId, userId: tokenUserId },
    });

    if (!find) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const deleteUserFile = await prismaConnnect.userClintFiles.delete({
      where: { id: paramsId, userId: tokenUserId },
    });

    UtilsFileUser.deleteFolderUser([
      deleteUserFile.userId,
      deleteUserFile.userClientId,
      deleteUserFile.file,
    ]);

    return deleteUserFile;
  }
}

export const userClientFilesService = new UserClientFilesService();
