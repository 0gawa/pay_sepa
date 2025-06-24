"use client";

import Button from '@/app/ui/button';

interface TransactionDataBocProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'custom';
  className?: string;
  buttonFunction: any;
}

export default function TransactionDataBox({ 
  children,
  color = 'danger',
  className = '',
  buttonFunction,
  ...props 
}: TransactionDataBocProps) {
  const baseClasses = 'bg-white p-4 rounded-lg shadow-sm border border-purple-200 flex justify-between items-center';
  return (
    <div {...props} className={`${baseClasses} ${className}`}>
      <div>
        {children}
      </div>
      <Button
        color={color}
        className="px-3 py-1 text-xs"
        onClick={buttonFunction}
      >
        削除
      </Button>
    </div>
  );
}
