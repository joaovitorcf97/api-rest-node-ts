import fs from 'node:fs';
import path from 'node:path';

export class UtilsFileUser {
  private static _userPath = ['assets', 'files'];

  private static _validateFolder(userID: string) {
    return fs.existsSync(path.resolve(...this._userPath, userID));
  }

  public static createFolderUser(userID: string) {
    if (!this._validateFolder(userID)) {
      fs.mkdirSync(path.resolve(...this._userPath, userID));
    }
  }

  public static deleteFolderUser(userID: string) {
    if (this._validateFolder(userID)) {
      return fs.rmSync(path.resolve(...this._userPath, userID), {
        recursive: true,
      });
    }

    throw new Error();
  }
}
