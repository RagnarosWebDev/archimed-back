import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { REQUIRED_KEY, ROLES_KEY } from './roles-auth.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user/user.model';
import { Role } from '../models/user/role.model';
import { TokenDto } from './token.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isNotRequired = this.reflector.getAllAndOverride<boolean | null>(
      REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      if (isNotRequired) {
        return true;
      }
      throw new ForbiddenException('Токена нет в заголовке');
    }
    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token)
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    let user: User;
    try {
      const data = this.jwtService.verify<TokenDto>(token);
      user = await this.userRepository.findOne({
        where: { id: data.id },
      });
    } catch {
      throw new ForbiddenException('Нет доступа');
    }
    if (
      requiredRoles &&
      requiredRoles.length != 0 &&
      !requiredRoles.includes(user.role)
    ) {
      throw new UnauthorizedException({
        message: 'У вас нет нужных ролей',
      });
    }
    req.user = user;
    return true;
  }
}
