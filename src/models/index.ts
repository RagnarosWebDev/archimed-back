import { Product } from './product.model';
import { Call } from './call.model';
import { User } from './user/user.model';
import { CharacteristicProduct } from './charactertistics-product/characteristic-product.model';
import { CharacteristicsToProduct } from './charactertistics-product/characteristics-to-product';
import { Characteristic } from './characteristics/characteristic.model';
import { CharacteristicType } from './characteristics/characteristic-type.model';
import { ModelCtor } from 'sequelize-typescript';
import { Category } from './category/category.model';
import { CategoryProduct } from './category/category-product.model';
import { Order } from './order/order.model';
import { OrderProduct } from './order/order.product.model';

export const models: ModelCtor[] = [
  Product,

  Call,

  User,

  CharacteristicProduct,
  CharacteristicsToProduct,

  Characteristic,
  CharacteristicType,

  Category,
  CategoryProduct,

  Order,
  OrderProduct,
];
