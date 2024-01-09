import { CharacteristicModule } from './characteristic/characteristic.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

export default [AuthModule, CharacteristicModule, ProductModule, UsersModule];
