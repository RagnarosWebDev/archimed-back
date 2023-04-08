import {
  Body,
  Controller,
  Get,
  Param,
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
import { Roles, SkipEmailVerification } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BanDto } from './dto/ban.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '../roles/role.model';
import { EditUserDto } from '../auth/dto/edit-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  @ApiOperation({ summary: 'Бан пользователя' })
  @ApiResponse({ status: 200 })
  @Post('/ban')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async ban(@Body() dto: BanDto) {
    return await this.userService.ban(dto);
  }
  @ApiOperation({ summary: 'Анбан пользователя' })
  @ApiResponse({ status: 200 })
  @Post('/unBan/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async unBan(@Param('id') id: number) {
    return await this.userService.unBan(id);
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @ApiResponse({ status: 200, type: User })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get('/userById/:id')
  getById(@Param('id') id) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Информация о пользователе' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @SkipEmailVerification()
  @Get('/myInfo')
  userInfo(@Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.getUserById(
      user.id,
      [Role],
      ['banned', 'banReason'],
    );
  }

  @ApiOperation({ summary: 'Получить код еще раз' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @Post('reSend')
  @SkipEmailVerification()
  resend(@Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.sendCode(user.id);
  }

  @ApiOperation({ summary: 'Подтвердить почту' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @SkipEmailVerification()
  @Post('activate/:code')
  activate(@Req() req: Request, @Param('code') code: number) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.activate(user.id, code);
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll(@Query('row') row: number) {
    return this.userService.getAllUsers(row);
  }

  @ApiOperation({ summary: 'Изменить данные учетной записи' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard)
  @Post('/edit')
  edit(@Body() editUserDto: EditUserDto, @Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.edit(user.id, editUserDto);
  }

  @ApiOperation({ summary: 'Запрос на восстановление пароля' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sendResetCode')
  sendResetCode(@Query('email') email: string) {
    return this.userService.sendResetCode(email);
  }

  @ApiOperation({ summary: 'Восстановить пароль' })
  @ApiResponse({ status: 200 })
  @Post('/reset')
  reset(@Body() dto: ResetPasswordDto) {
    return this.userService.reset(dto);
  }
}
