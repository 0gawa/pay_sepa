'use client';

import { useState } from 'react';
import { Button, Form, Input,} from "@heroui/react";
import Modal from '@/app/ui/group/create-user-modal';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Member } from '@/app/type/member';

export default function Users({ groupId, groupMembers, setGroupMembers }: { groupId: string, groupMembers: Member[], setGroupMembers: React.Dispatch<React.SetStateAction<Member[]>>}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');

  const handleMemberNameChange = (e: any) => {
    setMemberName(e.target.value);
  };
  const onDeleteMember = (id: number) => {
    setGroupMembers( (prev: Member[]) => prev.filter( member => member.id !== id ) );
  };
  
  // TODO: APIを叩いてユーザーを追加する
  const onSubmit = (e: any) => {
    e.preventDefault();

    const isMember = groupMembers?.at(-1)?.id;
    const newMemberId = isMember ? isMember + 1 : 1;
    setGroupMembers((prev) => [...prev , { id: newMemberId + 1, name: memberName }]);

    console.log(e.currentTarget);
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
        <Button onPress={() => setIsModalOpen(true)} color="primary" className="inline-flex">
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
              <Button color="danger" onPress={() => onDeleteMember(member.id)} className="px-3 py-1 text-xs">
                削除
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新しいメンバーを追加">
        <Form className="w-full max-w-xs" onSubmit={onSubmit}>
          <Input
            id="memberName"
            label="メンバー名"
            type="text"
            value={memberName}
            onChange={handleMemberNameChange}
            placeholder="例: 山田太郎"
            isRequired
          />
          <div className="mt-6 flex justify-end gap-x-3">
            <Button type="button" color="secondary" onPress={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" color="primary">
              追加
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
