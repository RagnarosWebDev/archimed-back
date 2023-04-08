import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    forwardRef(() => UsersModule),
    GlobalJwtModule,
    MailerModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
