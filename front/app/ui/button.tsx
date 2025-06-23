'use client';

import { Button } from '@headlessui/react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; 
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'custom';
  className?: string;
}

export default function Example({
  children,
  color = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
  let colorClasses = '';

  switch (color) {
    case 'primary':
      colorClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      break;
    case 'secondary':
      colorClasses = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500';
      break;
    case 'danger':
      colorClasses = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'success':
      colorClasses = 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500';
      break;
    case 'custom':
      colorClasses = 'text-gray-800';
      break;
    default:
      colorClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }

  return (
    <Button
      className={`${baseClasses} ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
