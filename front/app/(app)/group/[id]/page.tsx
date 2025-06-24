import { Member }   from '@/lib/types/member';
import { Transaction, GetResponse } from '@/lib/types/transaction';
import GroupMembersClientWrapper from './_components/group-members-client-wrapper';

interface GetMemberResponse {
  user: Member[];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const groupId = params.id;
  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/users?groupId=${groupId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '取得に失敗しました。');
      }

      const data: GetMemberResponse = await response.json();

      console.log('UserIndex Response: ', data);
      return data.user;
    }catch (e: any) {
      console.error("Server Component: データフェッチエラー:", e.message);
      return [];
    }
  }
  const fetchGroupTransactions = async () => {
    try {
      const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/transactions?groupId=${groupId}`, {
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
  const groupMembers: Member[] = await fetchGroupMembers();
  const groupTransactions: Transaction[] = await fetchGroupTransactions();
  
  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <GroupMembersClientWrapper groupId={groupId} initialGroupMembers={groupMembers} initialGroupTransactions={groupTransactions} />
    </div>
  );
}
