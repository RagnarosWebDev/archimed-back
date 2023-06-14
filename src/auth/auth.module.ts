import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { GlobalJwtModule } from '../global/global-jwt.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => UsersModule),
    GlobalJwtModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
