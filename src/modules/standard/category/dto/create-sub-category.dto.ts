import { OmitType } from '@nestjs/swagger';
import { SubCategoryCreationAttributes } from '../../../../models/category/sub-category.model';

export class CreateSubCategoryDto extends OmitType(
  SubCategoryCreationAttributes,
  ['id'],
) {}
