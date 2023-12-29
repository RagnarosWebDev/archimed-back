import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreationProductVariantCreationAttributes } from '../many/product-variant.model';

export class EditProductVariantDto extends PartialType(
  OmitType(CreationProductVariantCreationAttributes, ['id']),
) {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;
}
