import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { RowDto } from '../../../../utils/row.dto';

export class FilterProductDto extends IntersectionType(
  PartialType(OmitType(CreateProductDto, ['categories'])),
  RowDto,
) {
  @ApiProperty({
    example: 5,
    description: 'Количество элементов',
  })
  countItems: number;

  @ApiProperty({
    example: 'asd',
    description: 'Категория',
  })
  category: string;
}

export class FilterUnRowedProductDto extends OmitType(FilterProductDto, [
  'row',
]) {}
