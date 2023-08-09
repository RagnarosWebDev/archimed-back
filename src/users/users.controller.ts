import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from './role.model';
import { EditUserDto } from './dto/edit-user.dto';

@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Информация о пользователе' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @Get('/myInfo')
  userInfo(@Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.getUserById(user.id);
  }

  @ApiOperation({ summary: 'Информация о пользователе по id' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @Get('/userById')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getUserById(@Query('id') id: number) {
    return this.userService.getUserById(id);
  }
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  getAll(@Query('row') row: number) {
    return this.userService.getAllUsers(row);
  }

  @ApiOperation({ summary: 'Получение кол-ва страниц пользователей' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/countPages')
  countPages() {
    return this.userService.countPages();
  }

  @ApiOperation({ summary: 'Редактирование пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('edit')
  edit(@Req() req: Request, @Body() dto: EditUserDto) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.update(user.id, dto);
  }
}
