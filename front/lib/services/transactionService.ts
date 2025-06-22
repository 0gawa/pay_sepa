import { GetResponse } from '@/lib/types/transaction';
import { Transaction } from '@/lib/types/transaction';

export const getTransactions = async (groupId: string) => {
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
        payer: tx.payer.id,
        participants: tx.participants.map(p => p.id),
      }));
      return newTransactions;
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
