"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '@/app/ui/modal';
import Button from '@/app/ui/button';
import { Group } from '@/lib/types/group';

export default function GroupHeader({ group } : { group: Group }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-3xl font-semibold text-gray-800">{group.name}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="グループ詳細を表示"
        >
          <MagnifyingGlassIcon className="w-7 h-7 text-gray-600" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="グループ詳細">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
          <p className="mt-2 text-gray-600">
            {group.description || 'このグループには説明がありません。'}
          </p>
          <div className="mt-6 flex justify-end">
            <Button color="secondary" onClick={() => setIsModalOpen(false)}>
              閉じる
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
