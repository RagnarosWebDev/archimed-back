import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreationProductAttributes } from '../../../../models/product.model';
import { CharacteristicProductCreationAttributes } from '../../../../models/charactertistics-product/characteristic-product.model';

export class UpdateProductDto extends PartialType(
  OmitType(CreationProductAttributes, ['id']),
) {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: [''],
    description: 'Категории',
  })
  categories: number[];
}

export class UpdateProductCharacteristicDto extends PartialType(
  OmitType(CharacteristicProductCreationAttributes, [
    'id',
    'image',
    'productId',
  ]),
) {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
