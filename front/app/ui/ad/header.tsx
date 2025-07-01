"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        menuRef.current.style.maxHeight = `${menuRef.current.scrollHeight}px`;
      } else {
        menuRef.current.style.maxHeight = '0px';
      }
    }
  }, [isOpen]);

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 rounded-lg p-2 hover:bg-indigo-50 transition-colors">
          Just Pay
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="#features" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">特徴</Link></li>
            <li><Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">使い方</Link></li>
            <li><Link href="/group/new" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">始める</Link></li>
          </ul>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <ul className="flex flex-col items-center space-y-4 py-2 border-t border-gray-200">
          <li>
            <Link href="#features" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors" onClick={() => setIsOpen(false)}>
              特徴
            </Link>
          </li>
          <li>
            <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors" onClick={() => setIsOpen(false)}>
              使い方
            </Link>
          </li>
          <li>
            <Link href="#download" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors" onClick={() => setIsOpen(false)}>
              始める
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
