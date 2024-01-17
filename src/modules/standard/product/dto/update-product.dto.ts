import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreationProductAttributes } from '../../../../models/product.model';

export class UpdateProductDto extends PartialType(
  OmitType(CreationProductAttributes, ['id']),
) {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;
}
