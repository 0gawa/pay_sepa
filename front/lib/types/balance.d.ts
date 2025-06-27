import { Member } from "./member"

export interface Balance {
  payer:  Member;
  receiver: Member;
  amount: number;
}

export interface GetResponse {
  balance: Balance[];
}
