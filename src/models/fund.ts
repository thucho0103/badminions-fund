export interface FundRecord {
  id: string;
  month: number;
  date: string;      // dd/MM
  description: string;
  income: number;
  expense: number;
  note?: string;
}
