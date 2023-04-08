import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiModelProperty({
    type: String,
    example: '12345678',
    description: 'Новый пароль(опционально)',
  })
  readonly password?: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiModelProperty({
    type: String,
    example: '12345678',
    description: 'Старый пароль',
  })
  readonly confirmPassword?: string;
}
