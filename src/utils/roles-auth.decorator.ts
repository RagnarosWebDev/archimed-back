import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/user/role.model';

export const ROLES_KEY = 'roles';
export const REQUIRED_KEY = 'required';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const NotRequired = () => SetMetadata(REQUIRED_KEY, true);
