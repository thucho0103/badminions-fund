export interface Member {
  id: number;
  name: string;
  payments: { [period: string]: number };
  total: number;
  isInactive?: boolean;
}