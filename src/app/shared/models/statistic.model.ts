export interface DefaultStat {
  id?: string;
  name: string;
  abv: string;
  dices: string[];
}
export interface Statistic extends DefaultStat {
  userId?: string;
  total: number;
  current: number;
}
