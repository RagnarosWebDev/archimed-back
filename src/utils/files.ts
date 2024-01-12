import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

export const fileOption: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, callback) => {
      const path = `${Date.now()}-${Math.random()}.${file.originalname
        .split('.')
        .at(-1)}`;

      file.filename = `images/${path}`;

      req.body[file.fieldname] = file;

      callback(null, path);
    },
  }),
};
