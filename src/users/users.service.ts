import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { UserRoles } from '../roles/user-roles.model';
import { BanDto } from './dto/ban.dto';
import { Code, CodeType } from '../auth/code.model';
import { MailerService } from '@nestjs-modules/mailer';
import { Includeable, Op } from 'sequelize';
import { Role } from '../roles/role.model';
import { EditUserDto } from '../auth/dto/edit-user.dto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import sequelize from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    @InjectModel(Code) private codeRepository: typeof Code,
    private roleService: RolesService,
    private mailerService: MailerService,
  ) {}

  async ban(dto: BanDto) {
    const user: User = await this.getUserById(dto.userId);
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.banned) {
      throw new HttpException(
        'Пользвователь уже забанен',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update(
      {
        banned: true,
        banReason: dto.message,
      },
      { where: { id: dto.userId } },
    );
    return { banned: true };
  }

  async unBan(userId: number) {
    const user: User = await this.getUserById(userId);
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.banned) {
      throw new HttpException(
        'Пользвователь не забанен',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update(
      {
        banned: false,
        banReason: null,
      },
      { where: { id: userId } },
    );
    return { banned: false };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const code = await this.codeRepository.create({
      code: 1000 + Math.floor(Math.random() * 8999),
      type: CodeType.VERIFY,
    });
    const user = await this.userRepository.create({
      email: dto.email,
      password: dto.password,
      verifyId: code.id,
    });
    await this.sendCode(user.id);
    return user;
  }

  async sendCode(userId: number) {
    const user: User = await this.getUserById(userId, [
      { model: Code, as: 'verify' },
    ]);
    if (!user.verify) {
      throw new HttpException(
        'Пользвователь уже подтвердил email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const code: Code = await this.codeRepository.findOne({
      where: { id: user.verify.id },
    });
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Подтверждение почты',
      template: './confirm',
      context: {
        name: user.email,
        code: code.code,
      },
    });
    return { send: true };
  }

  async activate(userId: number, code: number) {
    const user: User = await this.getUserById(userId, [
      { model: Code, as: 'verify' },
    ]);
    if (!user.verify) {
      throw new HttpException(
        'Пользвователь уже подтвердил email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const codeObject = await this.codeRepository.findOne({
      where: { id: user.verify.id },
    });
    if (codeObject.code != code) {
      throw new HttpException('Код не совпадает', HttpStatus.BAD_REQUEST);
    }
    const verifyId = user.verifyId;
    await user.$set('verify', null);
    await this.codeRepository.destroy({ where: { id: verifyId } });
    return { success: true };
  }

  async getAllUsers(row: number) {
    return await this.userRepository.findAll({
      include: [Role],
      order: ['id'],
      limit: 50,
      offset: 50 * row,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getUserById(
    id: number,
    include: Includeable | Includeable[] = [],
    exclude: string[] = [],
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      include: include,
      attributes: {
        exclude: exclude,
      },
    });
  }

  async edit(userId: number, userEditDto: EditUserDto) {
    const user: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(
        'Пользователя не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userEditDto.password && userEditDto.password.length <= 5) {
      throw new HttpException(
        'Пароль должен быть больше 5 символов ',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!(await bcrypt.compare(userEditDto.confirmPassword, user.password))) {
      throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.update(
      {
        password: userEditDto.password
          ? await bcrypt.hash(userEditDto.password, 5)
          : user.password,
      },
      {
        where: {
          id: userId,
        },
      },
    );
    return this.getUserById(user.id, [Role], ['banned', 'banReason']);
  }

  async sendResetCode(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: Code,
          as: 'reset',
        },
      ],
    });
    if (!user) {
      throw new HttpException(
        'Такого пользователя не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    let code = user.reset;
    if (!code) {
      let generateCode;
      do {
        generateCode = 1000 + Math.floor(Math.random() * 8999);
      } while (
        await this.codeRepository.findOne({ where: { code: generateCode } })
      );
      code = await this.codeRepository.create({
        code: generateCode,
        type: CodeType.RESET,
      });
      await user.$set('reset', code.id);
    }
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      template: './reset',
      context: {
        name: user.email,
        code: code.code,
      },
    });
    return { send: true };
  }

  async reset(resetDto: ResetPasswordDto) {
    const code = await this.codeRepository.findOne({
      where: {
        code: resetDto.resetCode,
        type: CodeType.RESET,
      },
      include: [{ model: User, as: 'resetUser' }],
    });
    if (!code) {
      throw new HttpException('Такого кода нет', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.update(
      {
        password: await bcrypt.hash(resetDto.password, 5),
      },
      {
        where: {
          id: code.resetUser.id,
        },
      },
    );
    await code.resetUser.$set('reset', null);
    await this.codeRepository.destroy({
      where: {
        id: code.id,
      },
    });
    return { success: true };
  }
}
