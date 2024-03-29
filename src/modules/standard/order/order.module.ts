import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderProduct } from '../../../models/order/order.product.model';
import { Order } from '../../../models/order/order.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [SequelizeModule.forFeature([Order, OrderProduct])],
})
export class OrderModule {}
