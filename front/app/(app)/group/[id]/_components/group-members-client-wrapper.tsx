'use client';

import { useState } from 'react';
import { Member } from '@/app/type/member';
import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

interface GroupMembersClientWrapperProps {
  groupId: string;
  initialGroupMembers: Member[];
}

export default function GroupMembersClientWrapper({ groupId, initialGroupMembers }: GroupMembersClientWrapperProps) {
  const [groupMembers, setGroupMembers] = useState<Member[]>(initialGroupMembers || []);

  return (
    <>
      <div>
        <Transactions groupId={groupId} groupMembers={groupMembers} setGroupMembers={setGroupMembers} />
      </div>
      <div className="mt-6">
        <Users groupId={groupId} groupMembers={groupMembers} setGroupMembers={setGroupMembers} />
      </div>
    </>
  );
}
