"use client";

import { Button } from '@heroui/react';

export default function StartAppSection() {
  return (
    <section id="download" className="py-16 px-4 bg-indigo-600 text-white text-center shadow-md mx-auto max-w-7xl">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-2">会員登録は不要</h2>
        <h2 className="text-4xl font-bold mb-6">今すぐJust Payを始めよう！</h2>
        <p className="text-xl mb-10 opacity-90">
          もう割り勘で悩む必要はありません。あなたのグループ会計をスマートに。
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            as="a"
            href="#"
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            今すぐ始める
          </Button>
        </div>
      </div>
    </section>
  );
}
