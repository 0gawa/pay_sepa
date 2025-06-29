'use client';

import { useState } from 'react';
import { Form } from "@heroui/react";
import Modal from '@/app/ui/group/create-user-modal';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Member, GetResponse } from '@/lib/types/member';
import { Balance } from '@/lib/types/balance';
import { Transaction } from '@/lib/types/transaction';
import Button from '@/app/ui/button';
import Input from '@/app/ui/form/text-input';
import { deleteUser } from '@/lib/services/user-service';
import { fetchTransactions } from '@/lib/services/transaction-service';
import { fetchGroupBalances } from '@/lib/services/balance-service';

interface UsersProps { 
  groupId: string,
  groupMembers: Member[],
  setGroupMembers: React.Dispatch<React.SetStateAction<Member[]>>, 
  setGroupTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setGroupBalances: React.Dispatch<React.SetStateAction<Balance[]>>
}

export default function Users({
  groupId,
  groupMembers = [],
  setGroupMembers,
  setGroupTransactions,
  setGroupBalances
}: UsersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');

  const handleMemberNameChange = (e: any) => {
    setMemberName(e.target.value);
  };
  
  const fetchGroupMembers = async () => {
    const maxRetries: number = 3;
    const delayMs: number = 1000;
    let attempts: number = 0;
    while (attempts < maxRetries) {
      attempts++;
      console.log(`Fetching UserIndex (Attempt ${attempts} of ${maxRetries})`);
      try {
        const response = await fetch(`/api/group/users?groupId=${groupId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }

        const data: GetResponse = await response.json();
        setGroupMembers(data.user);
      } catch (error: any) {
        console.warn(`Fetch encountered an error: ${error.message}.`);
        if (attempts < maxRetries) {
          console.warn(`Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else {
          console.error(`Fetch definitively failed after ${attempts} attempts.`);
          throw error;
        }
      }
    }
  }

  const onDeleteMember = async (e: any, id: number) => {
    e.preventDefault();
    if (window.confirm('削除すると、取引データも削除されます。よろしいですか？')) {
      await deleteUser(groupId, id);
      await fetchGroupMembers();
      await fetchTransactions(groupId, setGroupTransactions);
      fetchGroupBalances(groupId, setGroupBalances);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/group/users/create?groupId=${groupId}&name=${memberName}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '登録に失敗しました。');
      }
    }catch (e: any) {
      console.error('Error adding member:', e);
      return [];
    }
    fetchGroupMembers();

    console.log('GroupMembers: ' + groupMembers);
    setMemberName('');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-blue-500" />
          グループメンバー
        </h3>
        <Button onClick={() => setIsModalOpen(true)} color="primary" className="inline-flex">
          <PlusIcon className="h-5 w-5"/>
          メンバー追加
        </Button>
      </div>

      {groupMembers?.length === 0 ? (
        <p className="text-gray-500 text-center py-4">まだメンバーがいません。追加してください。</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {groupMembers?.map((member) => (
            <li key={member.id} className="py-3 flex items-center justify-between">
              <span className="text-gray-700">{member.name}</span>
              <Button color="danger" onClick={(e: any) => onDeleteMember(e, member.id)} className="px-3 py-1 text-xs">
                削除
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新しいメンバーを追加">
        <Form className="flex justify-center" onSubmit={onSubmit}>
          <div className="w-full">
            <Input
              id="memberName"
              label="メンバー名"
              type="text"
              value={memberName}
              onChange={handleMemberNameChange}
              placeholder="例: 山田太郎"
              required
            />
            <div className="mt-6 flex justify-center gap-x-6">
              <Button type="button" color="secondary" onClick={() => setIsModalOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" color="primary">
                追加
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
