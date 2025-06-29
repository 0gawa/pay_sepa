"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/button';
import Modal from '@/app/ui/modal';
import TransactionDetail from '@/app/ui/group/transaction-detail';
import { Transaction } from '@/lib/types/transaction';

interface TransactionDataBocProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'custom';
  className?: string;
  buttonFunction: any;
  selectedTransaction: Transaction;
}

export default function TransactionDataBox({ 
  children,
  color = 'danger',
  className = '',
  buttonFunction,
  selectedTransaction,
  ...props 
}: TransactionDataBocProps) {
  const baseClasses = 'bg-white p-4 rounded-lg shadow-sm border border-purple-200 flex justify-between items-center';
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  return (
    <div {...props} className={`${baseClasses} ${className}`}>
      <div>
        {children}
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={() => setIsDetailModalOpen(true)} color="secondary" className="p-2" aria-label="詳細を表示">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </Button>
        <Button
          color={color}
          className="px-4 py-1 text-xs"
          onClick={buttonFunction}
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="取引詳細">
        <TransactionDetail transaction={selectedTransaction} />
      </Modal>
    </div>
  );
}
