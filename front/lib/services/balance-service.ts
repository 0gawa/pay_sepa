import { Balance, GetResponse } from "@/lib/types/balance";

export const returnGroupBalanceData = async (groupId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONT_GROUP_URL}/api/group/balances?groupId=${groupId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch group balance');
    }
    
    const data: GetResponse = await response.json();
    return data.balance;
  } catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return [];
  }
}

export const fetchGroupBalances = async (groupId: string, setGroupBalances: React.Dispatch<React.SetStateAction<Balance[]>>) => {
  try {
    const response = await fetch(`/api/group/balances?groupId=${groupId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch group balance');
    }
    
    const data: GetResponse = await response.json();
    setGroupBalances(data.balance);
  } catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return;
  }
}
