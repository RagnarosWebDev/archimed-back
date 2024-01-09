import configGlobalModule from './config.global.module';
import dbGlobalModule, { globalModelsModule } from './db.global.module';
import jwtGlobalModule from './jwt.global.module';
import staticPathGlobalModule from './static-path.global.module';
import multerGlobalModule from './multer.global.module';
import mailerGlobalModule from './mailer.global.module';

export default [
  ...configGlobalModule,
  ...dbGlobalModule,
  ...jwtGlobalModule,
  ...staticPathGlobalModule,
  ...multerGlobalModule,
  ...mailerGlobalModule,
  ...globalModelsModule,
];
