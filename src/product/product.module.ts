import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { ProductVariant } from './many/product-variant.model';
import { ProductVariantTable } from './many/product-variant-table';
import { ProductVariantVariants } from './many/product-variant-variants.model';
import { Variant } from '../variant/variant.model';
import { User } from '../users/user.model';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Product,
      ProductVariant,
      ProductVariantTable,
      ProductVariantVariants,
      Variant,
    ]),
    GlobalJwtModule,
    forwardRef(() => AuthModule),
  ],
})
export class ProductModule {}
