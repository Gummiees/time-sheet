import { BaseUser } from './base.model';

export interface TimeSheet extends BaseUser {
  date: string;
  typeId?: string;
}
