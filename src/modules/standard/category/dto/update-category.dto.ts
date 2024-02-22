import { OmitType } from '@nestjs/swagger';
import { CategoryCreationAttributes } from '../../../../models/category/category.model';

export class UpdateCategoryDto extends OmitType(CategoryCreationAttributes, [
  'subCategories',
  'parentCategory',
]) {}
