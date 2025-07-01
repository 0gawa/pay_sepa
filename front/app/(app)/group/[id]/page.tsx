import { Member }   from '@/lib/types/member';
import { Transaction } from '@/lib/types/transaction';
import GroupMembersClientWrapper from './_components/group-members-client-wrapper';
import GroupHeader from './_components/group-header';
import { returnGroupTransactionData } from '@/lib/services/transaction-service';
import { returnGroupMemberData } from '@/lib/services/user-service';
import { Balance } from '@/lib/types/balance';
import { returnGroupBalanceData } from '@/lib/services/balance-service';
import { returnGroup } from '@/lib/services/group-service';
import { Group } from '@/lib/types/group';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const groupId: string = params.id;

  const groupMembers: Member[] = await returnGroupMemberData(groupId);
  const groupTransactions: Transaction[] = await returnGroupTransactionData(groupId);
  const initialGroupBalances: Balance[] = await returnGroupBalanceData(groupId);
  const group: Group = await returnGroup(groupId);

  
  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <div className="ml-3 my-3">
        <GroupHeader group={group} />
      </div>
      <GroupMembersClientWrapper
        groupId={groupId}
        initialGroupMembers={groupMembers}
        initialGroupTransactions={groupTransactions} 
        initialGroupBalances={initialGroupBalances}
      />
    </div>
  );
}
