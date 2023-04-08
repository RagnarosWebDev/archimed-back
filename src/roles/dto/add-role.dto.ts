import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ADMIN',
    description: 'Имя роли',
  })
  readonly roleName: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Id пользователя',
  })
  readonly id: number;
  constructor(value: string, id: number) {
    this.roleName = value;
    this.id = id;
  }
}
