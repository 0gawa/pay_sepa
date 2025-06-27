'use client';

import { useState } from 'react';
import { Member } from '@/lib/types/member';
import { Balance } from '@/lib/types/balance';
import { Transaction } from '@/lib/types/transaction';
import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';
import Balances from '@/app/ui/group/balances';

interface GroupMembersClientWrapperProps {
  groupId: string;
  initialGroupMembers: Member[];
  initialGroupTransactions: Transaction[];
  initialGroupBalances: Balance[];
}

export default function GroupMembersClientWrapper({ groupId, initialGroupMembers, initialGroupTransactions, initialGroupBalances }: GroupMembersClientWrapperProps) {
  const [groupMembers, setGroupMembers] = useState<Member[]>(initialGroupMembers || []);
  const [groupTransactions, setGroupTransactions] = useState<Transaction[]>(initialGroupTransactions || []);
  const [groupBalances, setGroupBalances] = useState<Balance[]>(initialGroupBalances || []);

  return (
    <>
      <div>
        <Transactions groupId={groupId} groupMembers={groupMembers} groupTransactions={groupTransactions} setGroupTransactions={setGroupTransactions} />
      </div>
      <div className='mt-6'>
        <Balances groupId={groupId} groupBalances={groupBalances} />
      </div>
      <div className="mt-6">
        <Users groupId={groupId} groupMembers={groupMembers} setGroupMembers={setGroupMembers} setGroupTransactions={setGroupTransactions}/>
      </div>
    </>
  );
}
