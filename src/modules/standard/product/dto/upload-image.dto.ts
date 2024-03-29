import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    example: 1,
    description: 'Id продукта с характ-ми',
  })
  characteristicProductId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
