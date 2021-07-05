import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles); // fetch from decorator an array of values
