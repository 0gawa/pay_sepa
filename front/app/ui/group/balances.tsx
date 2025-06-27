"use client";

import { useState } from 'react';
import { CurrencyYenIcon } from '@heroicons/react/24/outline';
import { Balance } from '@/lib/types/balance';

export default function Balances({ groupId, groupBalances }: { groupId: string, groupBalances: Balance[] }) {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <CurrencyYenIcon className="h-6 w-6 mr-2 text-blue-500" />
          最適な清算
        </h3>
      </div>

      {groupBalances.length === 0 ? (
        <p className="text-gray-600 text-center py-4">まだ取引情報がありません。</p>
      ) : (
        <div className="space-y-4">
          {groupBalances.map((balance, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-lg text-gray-800">
                <span className="font-semibold">{balance.payer.name}</span> が{' '}
                <span className="text-red-600 font-semibold">
                  {balance.amount.toLocaleString()}円
                </span> を{' '}
                <span className="font-semibold">{balance.receiver.name}</span> に支払う
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
