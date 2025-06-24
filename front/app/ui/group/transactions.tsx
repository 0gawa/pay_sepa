"use client";

import Modal from '@/app/ui/modal';
import TransactionDataBox from '@/app/ui/box/transaction-data-box';
import { useState } from 'react';
import { CurrencyYenIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Form } from '@heroui/react';
import { Member } from '@/lib/types/member';
import { Transaction } from '@/lib/types/transaction';
import SelectInput from '@/app/ui/form/select-input';
import NumberInput from '@/app/ui/form/number-input';
import Textarea from '@/app/ui/form/textarea-input';
import Button from '@/app/ui/button';
import {fetchTransactions, deleteTransaction } from '@/lib/services/transaction-service';

interface TransactionProps {
  groupId: string,
  groupMembers: Member[],
  groupTransactions: Transaction[],
  setGroupTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

export default function Transactions({ groupId, groupMembers=[], groupTransactions=[], setGroupTransactions }: TransactionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [payerId, setPayerId] = useState<number>();
  const [participants, setParticipants] = useState<Member[]>([]);
  
  const removeTransaction = async (e: any, id: number) => {
    e.preventDefault();
    if (window.confirm('この操作は取り消せません。本当に削除しますか？')) {
      deleteTransaction(groupId, id);
      fetchTransactions(groupId, setGroupTransactions);
      setMessage('取引が削除されました。');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  const handleParticipantChange = (member: Member, isChecked: boolean) => {
    if (isChecked) {
      setParticipants(prev => [...prev, member]);
    }else {
      setParticipants(prev => prev.filter(m => m !== member));
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if( !(amount > 0 && payerId && participants.length > 0) ) {
      amount <= 0 ? setMessage("金額は1円以上を入力してください。") : setMessage("");
      participants.length <= 0 ? setMessage("取引の参加者を選択してください") : setMessage("");
      return;
    }

    try {
      const participantsIds: number[] = participants.map(p => p.id);
      const response = await fetch(`/api/group/transactions/create?groupId=${groupId}&amount=${amount}&description=${description}&payerId=${payerId}&participants=${participantsIds}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '登録に失敗しました。');
      }

      // Reset payerId and participants to default after submission
      setPayerId(groupMembers[0].id);
      setParticipants(groupMembers);
    }catch (e: any) {
      setMessage('登録に失敗しました。再度、登録を試みてください')
      console.error('Error adding member:', e);
    }

    setMessage('');
    setDescription('');
    setAmount(0);
    setParticipants([]);
    fetchTransactions(groupId, setGroupTransactions);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <CurrencyYenIcon className="h-6 w-6 mr-2 text-blue-500" /> 取引一覧
        </h3>
        <Button onClick={() => setIsModalOpen(true)} color="primary" className="inline-flex">
          <PlusIcon className="h-5 w-5"/>
          取引を追加
        </Button>
      </div>
      {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {groupTransactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">まだ取引がありません。</p>
      ) : (
        <div className="space-y-4">
          {groupTransactions.map((tx: Transaction) => (         
            <TransactionDataBox
              key={tx.id}
              color="danger"
              buttonFunction={(e: any) => removeTransaction(e, tx.id)}
            >
              <p className="text-lg text-gray-800">
                <span className="text-blue-600 font-semibold">{tx.payer.name}</span> が{' '}
                <span className="text-purple-600 font-semibold">¥{tx.amount.toLocaleString()}</span> を支払い
              </p>
              <p className="text-sm text-gray-600 mt-1">
                参加者: {tx.participants.map(pt => pt.name).join(', ')}
              </p>
            </TransactionDataBox>
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新しい取引を追加">
        <Form className="flex flex-col items-center justify-center" onSubmit={ onSubmit }>
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          <div className="w-full">
            <Textarea
              id="transactionDescription"
              label="内容"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 食費"
              required
            />
            <NumberInput
              id="transactionAmount"
              label="金額 (円)"
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="例: 3000"
              min="1"
              required
            />
            <div className="mt-4 w-full">
              {groupMembers.length === 0 ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支払者</label>
                  <p className="text-red-500 text-sm">まずメンバーを追加してください。</p>
                </>
              ) : (
                <SelectInput
                  id="transactionPayerBy"
                  label="支払者"
                  options={groupMembers}
                  onChange={(e) => setPayerId(e.target.value ? Number(e.target.value) : undefined)}
                  required
                />
              )}
            </div>
            <div className="mt-4 w-full">
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
                        checked={participants.includes(member)}
                        onChange={(e) => handleParticipantChange(member, e.target.checked)}
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
            <div className="mt-6 w-full flex justify-center gap-x-6">
              <Button type="button" color="secondary" onClick={() => setIsModalOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" data-disabled={groupMembers.length === 0}>
                追加
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
