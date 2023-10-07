import bcrypt from 'bcrypt';
import { prismaConnnect } from '../../../prismaConn';
import { UtilsFileUser } from '../utils/file-utils';
import { StatusErrorsEnum } from '../../../enum/status.enum';

class UserService {
  public async create(name: string, email: string, password: string) {
    const findUser = await prismaConnnect.user.findUnique({
      where: { email },
    });

    if (findUser) {
      throw new Error(StatusErrorsEnum.E409);
    }

    const create = await prismaConnnect.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 6),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    UtilsFileUser.createFolderUser(create.id);

    return create;
  }

  public async read(paramsId: string) {
    const findUser = await prismaConnnect.user.findUnique({
      where: { id: paramsId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!findUser) {
      throw new Error(StatusErrorsEnum.E404);
    }

    return findUser;
  }

  public async update(paramsID: string, name: string) {
    const findUser = await prismaConnnect.user.findUnique({
      where: { id: paramsID },
    });

    if (!findUser) {
      throw new Error(StatusErrorsEnum.E404);
    }

    const update = await prismaConnnect.user.update({
      where: { id: paramsID },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return update;
  }

  public async delete(paramsID: string) {
    try {
      UtilsFileUser.deleteFolderUser(paramsID);
      return await prismaConnnect.user.delete({ where: { id: paramsID } });
    } catch (error) {
      throw new Error(StatusErrorsEnum.E404);
    }
  }
}

export const userService = new UserService();
