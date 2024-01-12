import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubCategory } from '../../../models/category/sub-category.model';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [SequelizeModule.forFeature([SubCategory])],
})
export class CategoryModule {}
