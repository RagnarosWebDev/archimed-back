import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../../../models/order/order.model';
import { OrderProduct } from '../../../models/order/order.product.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { CharacteristicProduct } from '../../../models/charactertistics-product/characteristic-product.model';
import { Op } from 'sequelize';
import { Product } from '../../../models/product.model';
import { calculatePrice } from '../../../utils/calculate-price';
import { RowDto } from '../../../utils/row.dto';
import { calculateCountPage, rowed } from '../../../utils/shared.extension';
import { Characteristic } from '../../../models/characteristics/characteristic.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderProduct)
    private orderProductRepository: typeof OrderProduct,
    @InjectModel(CharacteristicProduct)
    private characteristicProductRepository: typeof CharacteristicProduct,
  ) {}

  async createOrder(order: CreateOrderDto, userId?: number) {
    const products = await this.characteristicProductRepository.findAll({
      where: {
        id: {
          [Op.in]: order.items.map((e) => e.productCharacteristicsId),
        },
      },
      include: [Product],
    });

    if (products.length != order.items.length) {
      throw new BadRequestException({ message: 'Таких продуктов уже нет' });
    }

    let sum = 0;

    for (const item of order.items) {
      const product = products.find(
        (e) => e.id == item.productCharacteristicsId,
      );

      if (!product.product.visible) {
        throw new BadRequestException({
          message: 'Этот продукт снят с продажи',
        });
      }

      if (product.availableCount < item.count) {
        throw new BadRequestException({
          message: `Товар ${product.product.name} частично раскупили. Повторите попытку позже`,
        });
      }

      sum += calculatePrice(item.count, product);
    }

    const createdOrder = await this.orderRepository.create({
      ...order,
      userId: userId,
      sum: sum,
    });

    for (const item of order.items) {
      await this.orderProductRepository.create({
        characteristicsProductId: item.productCharacteristicsId,
        orderId: createdOrder.id,
        count: item.count,
      });
    }

    return await this.orderRepository.findOne({
      where: {
        id: createdOrder.id,
      },
      include: [CharacteristicProduct],
    });
  }

  async list(row: RowDto) {
    return this.orderRepository.findAll(
      rowed(
        row.row,
        {
          include: [
            {
              model: CharacteristicProduct,
              include: [Product, Characteristic],
            },
          ],
        },
        20,
      ),
    );
  }

  async countAll() {
    const count = await this.orderRepository.count();

    return { pages: calculateCountPage(count, 20) };
  }
}
