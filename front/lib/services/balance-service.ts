import { GetResponse } from "@/lib/types/balance";

export const returnGroupBalanceData = async (groupId: string) => {
  try {
    const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/balances?groupId=${groupId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch group members');
    }
    
    const data: GetResponse = await response.json();
    return data.balance;
  } catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return [];
  }
}
