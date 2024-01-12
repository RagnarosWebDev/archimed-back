import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../models/user/user.model';
import { Roles } from '../../../utils/roles-auth.decorator';
import { RolesGuard } from '../../../utils/roles.guard';
import { Role } from '../../../models/user/role.model';
import { EditUserDto } from './dto/edit-user.dto';
import { Auth } from '../../../utils/auth-data.decorator';
import { TokenDto } from '../../../utils/token.dto';

@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Информация о пользователе' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @Get('/myInfo')
  userInfo(@Auth() user: TokenDto) {
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
  edit(@Body() dto: EditUserDto, @Auth() user: TokenDto) {
    return this.userService.update(user.id, dto);
  }
}
