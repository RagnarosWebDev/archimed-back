import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddValueVariantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '10 гр',
    description: 'Новое значение варианта',
  })
  readonly variantName: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Id варианта',
  })
  readonly variantId: number;
}
