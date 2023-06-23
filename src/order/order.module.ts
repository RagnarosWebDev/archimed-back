import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { AuthModule } from '../auth/auth.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { ProductVariant } from '../product/many/product-variant.model';
import { OrderValue } from './order-value.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    SequelizeModule.forFeature([User, Order, ProductVariant, OrderValue]),
    GlobalJwtModule,
    forwardRef(() => AuthModule),
  ],
  exports: [OrderService],
})
export class OrderModule {}
