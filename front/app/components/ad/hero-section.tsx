"use client"

import { Button } from "@heroui/react";

export default function HeroSection() {
  return (
    <main>
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 px-4 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            全員納得、スピーディ清算。
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            面倒な割り勘はもう終わり。サッとスマートに、全員と清算。
            グループ会計をこれ一本で完結させましょう。
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              as="a"
              href="/group/new"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              今すぐ始める
            </Button>
            <Button
              as="a"
              href="#features"
              className="bg-indigo-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >{/*2つのボタンの文字数を揃えるため、全角空白を挿入*/}
              機能を見る　
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
