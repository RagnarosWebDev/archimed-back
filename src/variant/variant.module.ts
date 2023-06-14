import { forwardRef, Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { GlobalJwtModule } from '../global/global-jwt.module';
import { AuthModule } from '../auth/auth.module';
import { Variant } from './variant.model';
import { ValueVariant } from './value-variant.model';

@Module({
  controllers: [VariantController],
  providers: [VariantService],
  imports: [
    SequelizeModule.forFeature([Variant, User, ValueVariant]),
    GlobalJwtModule,
    forwardRef(() => AuthModule),
  ],
})
export class VariantModule {}
