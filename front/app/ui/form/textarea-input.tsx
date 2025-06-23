'use client';

import { Field, Label, Textarea } from '@headlessui/react'

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  errorMessage?: string;
}

export default function TextareaInput({
  id,
  label,
  errorMessage,
  className = '',
  ...props
}: TextareaInputProps) {
  return (
    <div className="w-full mb-4">
      <Field>
        <Label className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      </Field>
      <Textarea
        id={id}
        className={`
          mt-1 block w-full rounded-md border-gray-300 shadow-sm
          focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2
          ${errorMessage ? 'border-red-500' : ''}
          ${className}
        `}
        rows={4}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
