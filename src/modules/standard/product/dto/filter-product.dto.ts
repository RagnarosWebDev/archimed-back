import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { RowDto } from '../../../../utils/row.dto';

export class FilterProductDto extends IntersectionType(
  PartialType(OmitType(CreateProductDto, ['categories'])),
  RowDto,
) {}

export class FilterUnRowedProductDto extends OmitType(FilterProductDto, [
  'row',
]) {}
