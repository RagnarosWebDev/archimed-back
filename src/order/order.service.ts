import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto, UserDto } from './dto/create-order.dto';
import { User } from '../users/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderValue } from './order-value.model';
import { ProductVariant } from '../product/many/product-variant.model';
import { Product } from '../product/product.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderValue) private orderValueRepository: typeof OrderValue,
    @InjectModel(ProductVariant)
    private productVariantRepository: typeof ProductVariant,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number) {
    const userData: UserDto = userId
      ? await this.userRepository.findOne({
          where: {
            id: userId,
          },
        })
      : dto;

    console.log(userData.email);

    const order: Order = await this.orderRepository.create({
      userId: userId,
      email: userData.email,
      phone: userData.phone,
      fullName: userData.fullName,
    });
    const productVariants: { productVariant: ProductVariant; count: number }[] =
      [];
    const orderValues: OrderValue[] = [];
    for (const item of dto.products) {
      const productVariant = await this.productVariantRepository.findOne({
        where: {
          id: item.productVariantId,
        },
      });
      if (productVariant.availableCount < item.count) {
        this.orderRepository.destroy({
          where: {
            id: order.id,
          },
        });
        throw new BadRequestException({
          message: 'Такого(их) товаров нет в наличии в данном количестве',
        });
      }
      productVariants.push({
        productVariant: productVariant,
        count: item.count,
      });
    }

    for (const productVariant of productVariants) {
      this.productVariantRepository.update(
        {
          availableCount:
            productVariant.productVariant.availableCount - productVariant.count,
        },
        {
          where: {
            id: productVariant.productVariant.id,
          },
        },
      );
      orderValues.push(
        await this.orderValueRepository.create({
          productVariantId: productVariant.productVariant.id,
          orderId: order.id,
          count: productVariant.count,
        }),
      );
    }

    order.$set(
      'orderValues',
      orderValues.map((u) => u.id),
    );
    order.orderValues = orderValues;
    return order;
  }

  async history(userId: number, row: number) {
    return this.orderRepository.findAll({
      order: ['id'],
      where: {
        userId: userId,
      },
      attributes: {
        exclude: ['phone', 'email', 'fullName'],
      },
      offset: row * 20,
      limit: 20,
      include: [
        {
          model: OrderValue,
          include: [
            {
              model: ProductVariant,
              include: [Product],
              attributes: {
                exclude: [
                  'productId',
                  'availableCount',
                  'secondPrice',
                  'thirdPrice',
                ],
              },
            },
          ],
          attributes: {
            exclude: ['id', 'orderId', 'productVariantId'],
          },
        },
      ],
    });
  }
}
