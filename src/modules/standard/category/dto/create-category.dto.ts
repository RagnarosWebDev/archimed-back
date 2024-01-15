import { OmitType } from '@nestjs/swagger';
import { CategoryCreationAttributes } from '../../../../models/category/category.model';

export class CreateCategoryDto extends OmitType(CategoryCreationAttributes, [
  'id',
  'subCategories',
  'parentCategory',
]) {}
