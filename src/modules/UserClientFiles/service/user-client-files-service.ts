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

  public async read() {}

  public async listAll() {}

  public async update() {}

  public async delete() {}
}

export const userClientFilesService = new UserClientFilesService();
