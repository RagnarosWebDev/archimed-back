import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { RolesController } from './roles.controller';
import { User } from '../users/user.model';
import { UserRoles } from './user-roles.model';
import { GlobalJwtModule } from '../global/global-jwt.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    GlobalJwtModule,
  ],
  exports: [RolesService],
})
export class RolesModule {}
