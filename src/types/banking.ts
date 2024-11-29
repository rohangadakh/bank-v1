export type BankName = string;

export interface BankEntry {
  id: string;
  bankName: string;
  masterCode: string;
  action: 'deposit' | 'withdraw';
  amount: number;
  utrNo: string;
  date: string;
}
