import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const SKIP_EMAIL_VERIFY = 'skip';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const SkipEmailVerification = () => SetMetadata(SKIP_EMAIL_VERIFY, true);
