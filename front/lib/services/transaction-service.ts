import { GetResponse } from '@/lib/types/transaction';
import { Transaction } from '@/lib/types/transaction';

export const returnGroupTransactionData = async (groupId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONT_GROUP_URL}/api/group/transactions?groupId=${groupId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch group members');
    }
    
    const data: GetResponse[] = await response.json();
    const newTransactions: Transaction[] = data.map(tx => ({
      id: tx.id,
      description: tx.description,
      amount: tx.amount,
      payer: tx.payer,
      participants: tx.participants,
    }));
    return newTransactions;
  } catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return [];
  }
}

export const fetchTransactions = async (groupId: string, setGroupTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>) => {
  const maxRetries: number = 3;
  const delayMs: number = 1000;
  let attempts: number = 0;

  while (attempts < maxRetries) {
    attempts++;
    console.log(`Fetching TransactionIndex (Attempt ${attempts} of ${maxRetries})`);
    try {
      const response = await fetch(`/api/group/transactions?groupId=${groupId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }

      const data: GetResponse[] = await response.json();
      const newTransactions: Transaction[] = data.map(tx => ({
        id: tx.id,
        description: tx.description,
        amount: tx.amount,
        payer: tx.payer,
        participants: tx.participants,
      }));
      return setGroupTransactions(newTransactions);
    }catch (error: any) {
      console.warn(`Fetch encountered an error: ${error.message}.`);
      if (attempts < maxRetries) {
        console.warn(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error(`Fetch definitively failed after ${attempts} attempts.`);
      }
    }
  }
  return [];
}

export const deleteTransaction = async (groupId: string, transactionId: number) => {
  try {
    const response = await fetch(`/api/group/transactions/destroy?groupId=${groupId}&transactionId=${transactionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : '削除に失敗しました。');
    }
  } catch (e: any) {
    console.error('Error deleting transaction:', e);
  }
}
