import { UserRole } from './roles.enum';

export interface User {
  email: string;
  password: string;
  roles: UserRole;
  id?: string;
}
