import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRoles } from '../roles/user-roles.model';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { Book } from './book.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Book]),
    GlobalJwtModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
