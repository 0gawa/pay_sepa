// APIのUserに関するレスポンスと一致させる
export interface Member {
  id: number;
  name: string;
}

export interface GetResponse {
  user: Member[];
}
