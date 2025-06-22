"use client";

import Modal from '@/app/ui/modal';
import { useState } from 'react';
import { CurrencyYenIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Form, Textarea, Input, Button } from '@heroui/react';
import { Member } from '@/lib/types/member';
import { GetResponse } from '@/lib/types/transaction';
import { Transaction } from '@/lib/types/transaction';
import SelectInput from '@/app/ui/form/select-input';

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
  // TODO: 支払者の変数名をAPIと同一表記にする
  const [payerId, setPayerId] = useState<number>();
  const [participants, setParticipants] = useState<Member[]>([]);
  
  const removeTransaction = (id: number) => {
    setGroupTransactions(groupTransactions.filter(tx => tx.id !== id));
    setMessage('取引が削除されました。');
    setTimeout(() => setMessage(''), 3000);
  };
  const handleParticipantChange = (member: Member, isChecked: boolean) => {
    if (isChecked) {
      setParticipants(prev => [...prev, member]);
    }else {
      setParticipants(prev => prev.filter(m => m !== member));
    }
  };
  const fetchTransactions = async () => {
    const maxRetries: number = 3;
    const delayMs: number = 1000;
    let attempts: number = 0;
    while (attempts < maxRetries) {
      attempts++;
      console.log(`Fetching TransactionIndex (Attempt ${attempts} of ${maxRetries})`);
      try {
        const response = await fetch(`/api/group/transactions?groupId=${groupId}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }
  
        const data: GetResponse[] = await response.json();
        const newTransactions: Transaction[] = data.map(tx => ({
          id: tx.id,
          description: tx.description,
          amount: tx.amount,
          payer: tx.payer.id,
          participants: tx.participants.map(p => p.id),
        }));
        setGroupTransactions(newTransactions);
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
  const onSubmit = async (e: any) => {
    e.preventDefault();

    if( !(amount > 0 && payerId && participants.length > 0) ) {
      payerId? console.log(""): console.error(payerId);
      participants.length > 0 ? console.log(""):console.error("participants");
      setIsModalOpen(false);
      return;
    }

    try {
      const participantsIds: number[] = participants.map(p => p.id);
      const response = await fetch(`/api/group/transactions/create?groupId=${groupId}&amount=${amount}&description=${description}&paidById=${payerId}&participants=${participantsIds}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '登録に失敗しました。');
      }

      // Reset paidBy and participants to default after submission
      setPayerId(groupMembers[0].id);
      setParticipants(groupMembers);
    }catch (e: any) {
      console.error('Error adding member:', e);
    }

    setDescription('');
    setAmount(0);
    fetchTransactions();
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
      {groupTransactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">まだ取引がありません。</p>
      ) : (
        <div className="space-y-4">
          {groupTransactions.map((tx: Transaction) => (
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
                id="transactionPayerBy"
                label="支払者"
                options={groupMembers}
                onChange={(e) => setPayerId(e.target.value ? Number(e.target.value) : undefined)}
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
