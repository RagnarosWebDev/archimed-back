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
import { Code } from './auth/code.model';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
      models: [User, Role, UserRoles, Code],
      autoLoadModels: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
      },
      template: {
        dir: join(__dirname, 'mailer'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    GlobalJwtModule,
  ],
  providers: [MailerModule],
  controllers: [],
  exports: [MailerModule],
})
export class AppModule {}
