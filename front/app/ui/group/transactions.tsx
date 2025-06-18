"use client";

import Modal from '@/app/ui/modal';
import { useState } from 'react';
import { CurrencyYenIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Form, Textarea, Input, Button } from '@heroui/react';
import { Member } from '@/app/type/member';
import { Transaction } from '@/app/type/transaction';
import SelectInput from '@/app/ui/form/select-input';

export default function Transactions({ groupId, groupMembers, setGroupMembers }: {groupId: string, groupMembers: Member[], setGroupMembers: React.Dispatch<React.SetStateAction<Member[]>> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>();
  const [paidBy, setPaidBy] = useState<number | ''>();
  const [participants, setParticipants] = useState<number[]>([]);

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
    setMessage('取引が削除されました。');
    setTimeout(() => setMessage(''), 3000);
  };
  const handleParticipantChange = (memberId: number, isChecked: boolean) => {
    if (isChecked) {
      setParticipants(prev => [...prev, memberId]);
    } else {
      setParticipants(prev => prev.filter(id => id !== memberId));
    }
  };
  const onAddTransaction = (transaction: any) => {
    const isMember = groupMembers.at(-1)?.id;
    const newMemberId = isMember ? isMember + 1 : 1;
    const data = {
      id: newMemberId + 1,
      description: transaction.description,
      amount: transaction.amount,
      payer: transaction.paidBy,
      participants: transaction.participants,
    }
    setTransactions(prev => [...prev, data]);
  }
  
  const onSubmit = (e: any) => {
    e.preventDefault();

    if (description.trim() && amount && amount > 0 && paidBy && participants.length > 0) {
      onAddTransaction({
        description: description.trim(),
        amount: Number(amount),
        paidBy,
        participants,
      });
      setDescription('');
      setAmount('');
      // Reset paidBy and participants to default after submission
      if (groupMembers.length > 0) {
        setPaidBy(groupMembers[0].id);
        setParticipants(groupMembers.map(m => m.id));
      } else {
        setPaidBy('');
        setParticipants([]);
      }
      setIsModalOpen(false);
    } else {
      console.error("入力が無効です。");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <CurrencyYenIcon className="h-6 w-6 mr-2 text-blue-500" /> 取引一覧
        </h3>
        <Button onPress={() => setIsModalOpen(true)} color="primary" className="inline-flex">
          <PlusIcon className="h-5 w-5"/>
          取引を追加
        </Button>
      </div>
      {transactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">まだ取引がありません。</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx: Transaction) => (
            <div key={tx.id} className="bg-white p-4 rounded-lg shadow-sm border border-purple-200 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  <span className="text-blue-600">{tx.payer}</span> が{' '}
                  <span className="text-purple-600">¥{tx.amount.toLocaleString()}</span> を支払い
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  参加者: {tx.participants.join(', ')}
                </p>
              </div>
              <button
                onClick={() => removeTransaction(tx.id)}
                className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-100"
                aria-label="取引を削除"
              >
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新しい取引を追加">
        <Form className="w-full max-w-xs" onSubmit={ onSubmit }>
          <Textarea
            id="transactionDescription"
            label="内容"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 食費"
            isRequired
          />
          <Input
            id="transactionAmount"
            label="金額 (円)"
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="例: 3000"
            min="1"
            isRequired
          />
          <div className="mt-4">
            {groupMembers.length === 0 ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">支払者</label>
                <p className="text-red-500 text-sm">まずメンバーを追加してください。</p>
              </>
            ) : (
              <SelectInput
                id="transactionPaidBy"
                label="支払者"
                options={groupMembers}
                value={paidBy}
                onChange={(e: any) => setPaidBy(e.target.value)}
                required
              />
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">参加者</label>
            {groupMembers.length === 0 ? (
              <p className="text-red-500 text-sm">まずメンバーを追加してください。</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {groupMembers?.map(member => (
                  <div key={member.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`participant-${member.id}`}
                      checked={participants.includes(member.id)}
                      onChange={(e) => handleParticipantChange(member.id, e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`participant-${member.id}`} className="ml-2 text-sm text-gray-700">
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-x-3">
            <Button type="button" color="secondary" onPress={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={groupMembers.length === 0 || participants.length === 0}>
              追加
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
