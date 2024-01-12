import { Global, Module } from '@nestjs/common';
import global from './modules/global';
import standard from './modules/standard';
import dbGlobalModule from './modules/global/db.global.module';
import jwtGlobalModule from './modules/global/jwt.global.module';

@Global()
@Module({
  imports: [...global, ...standard],
  exports: [...dbGlobalModule, ...jwtGlobalModule],
})
export class AppModule {}
