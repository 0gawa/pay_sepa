"use client";

import { useState } from 'react';

interface Transaction {
  id: number;
  payer: string;
  amount: number;
  participants: string[];
}

export default function Transactions({groupId}: {groupId: string}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState('');

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
    setMessage('取引が削除されました。');
    setTimeout(() => setMessage(''), 3000);
  };
  
  return (
    <div className="w-full p-6 bg-purple-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 mb-5 flex items-center">
        💰 取引一覧
      </h2>
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
    </div>
  )
}
