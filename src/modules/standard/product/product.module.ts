import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '../../../models/product.model';
import { CharacteristicProduct } from '../../../models/charactertistics-product/characteristic-product.model';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { Category } from '../../../models/category/category.model';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([
      Product,
      CharacteristicProduct,
      CharacteristicType,
      Category,
    ]),
  ],
})
export class ProductModule {}
