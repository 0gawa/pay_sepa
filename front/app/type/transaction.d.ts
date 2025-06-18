export interface Transaction{
  id: number;
  description: string;
  amount: number;
  payer: number;
  participants: number[]; // 複数人いることを考慮
}
