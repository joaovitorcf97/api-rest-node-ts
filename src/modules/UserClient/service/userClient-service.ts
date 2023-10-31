import { UtilsFileUser } from '../../../utils/file-utils';
import { StatusErrorsEnum } from '../../../enum/status.enum';
import { prismaConnnect } from '../../../prismaConn';

class UserClientService {
  public async create(
    tokenUserId: string,
    name: string,
    email: string,
    phone: string,
  ) {
    const user = await prismaConnnect.user.findUnique({
      where: { id: tokenUserId },
    });

    if (!user) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const create = await prismaConnnect.client.create({
      data: {
        name,
        email,
        phone,
        userId: tokenUserId,
      },
    });

    UtilsFileUser.createFolderUser([create.userId, create.id]);

    return create;
  }

  public async read(paramsId: string, tokenUserId: string) {
    const client = await prismaConnnect.client.findFirst({
      where: { id: paramsId, userId: tokenUserId },
    });

    if (!client) {
      throw new Error(StatusErrorsEnum.E404);
    }

    return client;
  }

  public async listAll(
    tokenUserId: string,
    page: number,
    search: string | undefined,
  ) {
    const pageSize = 11;
    const skip = (page - 1) * pageSize;
    let user;

    if (!search) {
      user = await prismaConnnect.user.findMany({
        where: { id: tokenUserId },
        include: {
          client: {
            skip,
            take: pageSize,
          },
        },
      });
    } else {
      user = await prismaConnnect.user.findMany({
        where: { id: tokenUserId },
        include: {
          client: {
            skip,
            take: pageSize,
            where: {
              name: {
                startsWith: search,
              },
            },
          },
        },
      });
    }

    if (!user) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const totalCount = await prismaConnnect.client.count({
      where: { userId: tokenUserId },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      page,
      pageSize,
      totalCount,
      totalPages,
      clients: user[0].client,
    };
  }

  public async update(
    tokenUserId: string,
    paramsId: string,
    name: string,
    email: string,
    phone: string,
  ) {
    const client = await prismaConnnect.client.findFirst({
      where: { id: paramsId, userId: tokenUserId },
    });

    if (!client) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const update = await prismaConnnect.client.update({
      where: { id: paramsId },
      data: {
        name,
        email,
        phone,
      },
    });

    return update;
  }

  public async delete(tokenUserId: string, paramsId: string) {
    const client = await prismaConnnect.client.findFirst({
      where: { id: paramsId, userId: tokenUserId },
    });

    if (!client) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const deleteClient = await prismaConnnect.client.delete({
      where: { id: paramsId },
    });

    UtilsFileUser.deleteFolderUser([deleteClient.userId, deleteClient.id]);
  }
}

export const userClientService = new UserClientService();
