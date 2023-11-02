import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import mime from 'mime';
import { Request } from 'express';

class MiddlewareUpload {
  private _storage: multer.StorageEngine | undefined;
  private _userPath = ['assets', 'files'];

  constructor() {
    this._configureStorage();
  }

  private _configureStorage() {
    this._storage = multer.diskStorage({
      destination: (request, file, cb) => {
        const tokenUserId = request.tokenUserId;
        const paramsId = request.params.id;

        if (
          !file ||
          !fs.existsSync(path.resolve(...this._userPath, tokenUserId, paramsId))
        ) {
          return cb(null, '');
        }

        return cb(null, path.resolve(...this._userPath, tokenUserId, paramsId));
      },
      filename: (request, file, cb) => {
        if (file) {
          const filename = new Date().getTime();
          const type = mime.getExtension(file.mimetype);

          return cb(null, `${filename}.${type}`);
        }

        return cb(null, '');
      },
    });
  }

  private _fileFilter() {
    return (
      reqquest: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback,
    ) => cb(null, true);
  }

  getConfig(): multer.Options {
    return {
      storage: this._storage,
      fileFilter: this._fileFilter(),
    };
  }
}

export const middlewareUpload = new MiddlewareUpload();
