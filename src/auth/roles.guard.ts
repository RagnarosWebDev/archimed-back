import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, SKIP_EMAIL_VERIFY } from './roles-auth.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles } from '../roles/user-roles.model';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(UserRoles) private roleRepository: typeof UserRoles,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const isSkip = this.reflector.get<boolean>(
      SKIP_EMAIL_VERIFY,
      context.getHandler(),
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('Токена нет в заголовке');
    }
    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token)
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    let user;
    try {
      const data = this.jwtService.verify(token);
      user = await this.userRepository.findOne({
        where: { id: data.id },
        include: [Role],
      });
    } catch {
      throw new ForbiddenException('Нет доступа');
    }
    if (user.banned) {
      throw new UnauthorizedException({
        message: 'Пользователь забанен по причине: ' + user.banReason,
      });
    }
    if (!isSkip && user.verifyId != null) {
      throw new UnauthorizedException({
        message: 'Аккаунт не подтвержден',
      });
    }
    if (
      requiredRoles &&
      requiredRoles.length != 0 &&
      !user.roles.some((role) => requiredRoles.includes(role.name))
    ) {
      throw new UnauthorizedException({
        message: 'У вас нет нужных ролей',
      });
    }
    return true;
  }
}
