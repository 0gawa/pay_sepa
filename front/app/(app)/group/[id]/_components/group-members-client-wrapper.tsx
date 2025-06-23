'use client';

import { useState } from 'react';
import { Member } from '@/lib/types/member';
import { Transaction } from '@/lib/types/transaction';
import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

interface GroupMembersClientWrapperProps {
  groupId: string;
  initialGroupMembers: Member[];
  initialGroupTransactions: Transaction[];
}

export default function GroupMembersClientWrapper({ groupId, initialGroupMembers, initialGroupTransactions }: GroupMembersClientWrapperProps) {
  const [groupMembers, setGroupMembers] = useState<Member[]>(initialGroupMembers || []);
  const [groupTransactions, setGroupTransactions] = useState<Transaction[]>(initialGroupTransactions || []);

  return (
    <>
      <div>
        <Transactions groupId={groupId} groupMembers={groupMembers} groupTransactions={groupTransactions} setGroupTransactions={setGroupTransactions} />
      </div>
      <div className="mt-6">
        <Users groupId={groupId} groupMembers={groupMembers} setGroupMembers={setGroupMembers} />
      </div>
    </>
  );
}
