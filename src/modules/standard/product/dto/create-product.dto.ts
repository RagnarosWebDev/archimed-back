import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreationProductAttributes } from '../../../../models/product.model';
import { CharacteristicProductCreationAttributes } from '../../../../models/charactertistics-product/characteristic-product.model';
import { CreateSubCategoryDto } from '../../category/dto/create-sub-category.dto';

export class CreateProductDto extends OmitType(CreationProductAttributes, [
  'id',
]) {
  @ApiProperty({
    example: Array.of<CreateVariantsDto>({
      variants: ['КГ'],
      price: 1000,
      availableCount: 100,
      minCount: 1,
      secondPrice: 1000,
      thirdPrice: 100,
      fourthPrice: 1000,
    }),
    description: 'Список вариацих и из значений',
  })
  productVariants: CreateVariantsDto[];

  @ApiProperty({
    example: ['Вес'],
  })
  variants: string[];

  @ApiProperty({
    example: [
      {
        name: 'asd',
        categoryName: 'asd',
      },
    ],
    type: [CreateSubCategoryDto],
  })
  categories: CreateSubCategoryDto[];
}

export class CreateVariantsDto extends OmitType(
  CharacteristicProductCreationAttributes,
  ['id', 'image', 'productId'],
) {
  @ApiProperty({
    example: ['5гр'],
    description: 'Список из значений вариантов',
  })
  variants: string[];
}
