'use client';

import { Input } from '@headlessui/react';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
}

export default function NumberInput({
  id,
  label,
  errorMessage,
  className = '',
  ...props
}: NumberInputProps) {
  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        type="number"
        id={id}
        className={`
          mt-1 block w-full rounded-md border-gray-300 shadow-sm
          focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2
          ${errorMessage ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
