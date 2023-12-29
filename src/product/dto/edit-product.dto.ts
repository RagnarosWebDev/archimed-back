import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreationProductAttributes } from '../product.model';

export class EditProductDto extends PartialType(
  OmitType(CreationProductAttributes, ['id']),
) {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;
}
