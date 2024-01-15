import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../../../models/order/order.model';
import { OrderProduct } from '../../../models/order/order.product.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderProduct)
    private orderProductRepository: typeof OrderProduct,
  ) {}
}
