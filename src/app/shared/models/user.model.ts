import { BaseUser } from './base.model';

export type UserType = 'admin' | 'user';

export interface User extends BaseUser {
  role: UserType;
  username?: string | null;
  email?: string | null;
}
