import { Member }   from '@/lib/types/member';
import { Transaction } from '@/lib/types/transaction';
import GroupMembersClientWrapper from './_components/group-members-client-wrapper';
import { returnGroupTransactionData } from '@/lib/services/transaction-service';
import { returnGroupMemberData } from '@/lib/services/user-service';
import { Balance } from '@/lib/types/balance';
import { returnGroupBalanceData } from '@/lib/services/balance-service';
import { returnGroupName } from '@/lib/services/group-service';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const groupId = params.id;

  const groupMembers: Member[] = await returnGroupMemberData(groupId);;
  const groupTransactions: Transaction[] = await returnGroupTransactionData(groupId);
  const initialGroupBalances: Balance[] = await returnGroupBalanceData(groupId);
  const groupName = await returnGroupName(groupId);

  
  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <h1 className="ml-3 mb-3 text-3xl font-semibold text-gray-800">{groupName}</h1>
      <GroupMembersClientWrapper
        groupId={groupId}
        initialGroupMembers={groupMembers}
        initialGroupTransactions={groupTransactions} 
        initialGroupBalances={initialGroupBalances}
      />
    </div>
  );
}
