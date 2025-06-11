'use client';

import { useState } from 'react';
import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

interface Member {
  id: number;
  name: string;
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  const [members, setMembers] = useState<Member[]>([]);

  const handleAddMember = (name: string) => {
    const newMember = { id: 1, name };
    setMembers((prev) => [...prev, newMember]);
  };
  const handleDeleteMember = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <div>
        {/* <Transactions groupId={group_id} /> */}
      </div>
      <div>
        <Users
          members={members}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
        />
      </div>
      <div>

      </div>
    </div>
  );
}
