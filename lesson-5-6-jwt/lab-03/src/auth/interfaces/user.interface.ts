import { UserRole } from './roles.enum';

export interface User {
  email: string;
  password: string;
  role: UserRole;
  id?: string;
}
