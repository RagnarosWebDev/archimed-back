import { Product } from './product.model';
import { Call } from './call.model';
import { User } from './user/user.model';
import { CharacteristicProduct } from './charactertistics-product/characteristic-product.model';
import { CharacteristicsToProduct } from './charactertistics-product/characteristics-to-product';
import { Characteristic } from './characteristics/characteristic.model';
import { CharacteristicType } from './characteristics/characteristic-type.model';
import { ModelCtor } from 'sequelize-typescript';
import { SubCategory } from './category/sub-category.model';
import { CategoryProduct } from './category/category-product.model';

export const models: ModelCtor[] = [
  Product,

  Call,

  User,

  CharacteristicProduct,
  CharacteristicsToProduct,

  Characteristic,
  CharacteristicType,

  SubCategory,
  CategoryProduct,
];
