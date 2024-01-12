import { CharacteristicModule } from './characteristic/characteristic.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

export default [
  AuthModule,
  CharacteristicModule,
  ProductModule,
  UsersModule,
  CategoryModule,
];
