import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreationProductAttributes } from '../product.model';
import { CreationProductVariantCreationAttributes } from '../many/product-variant.model';

export class CreateProductDto extends OmitType(CreationProductAttributes, [
  'id',
]) {
  @ApiProperty({
    example: Array.of<CreateVariantsDto>({
      productId: 1,
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
}

class CreateVariantsDto extends OmitType(
  CreationProductVariantCreationAttributes,
  ['id', 'image'],
) {
  @ApiProperty({
    example: ['5гр'],
    description: 'Список из значений вариантов',
  })
  variants: string[];
}
