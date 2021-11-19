import { BaseUser } from './base.model';

export interface TimeSheet extends BaseUser {
  date: Date;
  typeId?: string;
}
