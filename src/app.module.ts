import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { UserRoles } from './roles/user-roles.model';
import { GlobalJwtModule } from './global/global-jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BookModule } from './book/book.module';
import { Book } from './book/book.model';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Book],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    GlobalJwtModule,
    BookModule,
  ],
  providers: [MailerModule],
  controllers: [],
  exports: [MailerModule],
})
export class AppModule {}
