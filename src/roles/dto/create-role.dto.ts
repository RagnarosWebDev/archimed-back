import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ADMIN',
    description: 'Имя роли',
  })
  readonly name: string;
}
