import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from './role.model';
import { AddRoleDto } from './dto/add-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Роли пользователей')
@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Посмотреть все роли' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async all() {
    return await this.rolesService.all();
  }

  @ApiOperation({ summary: 'Получить роль по значению' })
  @ApiResponse({ status: 200, type: Role })
  @Get('/byValue/:value')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }

  @ApiOperation({ summary: 'Получить все роли текущего аккаунты' })
  @ApiResponse({ status: 200, type: Role })
  @Get('/myRoles')
  @UseGuards(RolesGuard)
  async myRoles(@Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return await this.rolesService.userRolesById(user.id);
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/addUserRole')
  addRole(@Body() addRoleDto: AddRoleDto) {
    return this.rolesService.addRole(addRoleDto);
  }

  @ApiOperation({ summary: 'Удалить роль' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/remove')
  removeRole(@Body() removeRoleDto: RemoveRoleDto) {
    return this.rolesService.removeRole(removeRoleDto);
  }
}
