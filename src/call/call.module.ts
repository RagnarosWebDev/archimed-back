import { forwardRef, Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Call } from './call.model';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Call, User]),
    GlobalJwtModule,
    forwardRef(() => AuthModule),
  ],
  providers: [CallService],
  controllers: [CallController],
  exports: [CallService],
})
export class CallModule {}
