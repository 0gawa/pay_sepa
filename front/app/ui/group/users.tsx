"use client";

import { useState } from 'react';

export default function Users({groupId}: {groupId: string}) {
  // テスト用ユーザー
  const [allParticipants, setAllParticipants] = useState<string[]>([
    '山田', '佐藤', '鈴木', '田中', '高橋'
  ]);
  const [message, setMessage] = useState('');
  const [newParticipantName, setNewParticipantName] = useState<string>('');

  const addNewParticipant = () => {
    const trimmedName = newParticipantName.trim();
    if (trimmedName && !allParticipants.includes(trimmedName)) {
      setAllParticipants(prev => [...prev, trimmedName]);
      setNewParticipantName('');
      setMessage(`${trimmedName} が参加者リストに追加されました。`);
      setTimeout(() => setMessage(''), 3000);
    } else if (allParticipants.includes(trimmedName)) {
      setMessage(`${trimmedName} はすでに参加者リストに存在します。`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="mb-10 p-6 bg-purple-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 mb-5 flex items-center">
        グループメンバー管理
      </h2>
      <div className="mb-4">
        <label htmlFor="new-participant" className="block text-sm font-medium text-gray-700 mb-1">
          新しいメンバーを追加:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="new-participant"
            value={newParticipantName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewParticipantName(e.target.value)}
            className="flex-grow p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            placeholder="例: 吉田"
          />
          <button
            onClick={addNewParticipant}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            追加
          </button>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-700 mb-2">現在のメンバー:</div>
      <div className="flex flex-wrap gap-2">
        {allParticipants.map(participant => (
          <span key={participant} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            {participant}
          </span>
        ))}
      </div>
    </div>
  );
}
