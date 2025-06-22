import { Group } from './group';
import { Member } from './member';

export interface Transaction{
  id: number;
  description: string;
  amount: number;
  payer: number;
  participants: number[]; // 複数人いることを考慮
}

export interface GetResponse {
  id: number;
  payer_id: number;
  amount: number;
  date;
  description: string;
  group: Group;
  payer: Member;
  participants: Member[];
}
