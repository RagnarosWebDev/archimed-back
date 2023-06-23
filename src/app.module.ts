import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.model';
import { GlobalJwtModule } from './global/global-jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Product } from './product/product.model';
import { VariantModule } from './variant/variant.module';
import { Variant } from './variant/variant.model';
import { ValueVariant } from './variant/value-variant.model';
import { ProductVariantTable } from './product/many/product-variant-table';
import { ProductVariantVariants } from './product/many/product-variant-variants.model';
import { ProductVariant } from './product/many/product-variant.model';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Order } from './order/order.model';
import { OrderValue } from './order/order-value.model';
import { OrderModule } from './order/order.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'images',
      serveRoot: '/images',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Product,
        Variant,
        ValueVariant,
        ProductVariantTable,
        ProductVariantVariants,
        ProductVariant,
        Order,
        OrderValue,
      ],
      //sync: { force: true, alter: false },
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    GlobalJwtModule,
    VariantModule,
    ProductModule,
    OrderModule,
  ],
  providers: [MailerModule],
  controllers: [],
  exports: [],
})
export class AppModule {}
