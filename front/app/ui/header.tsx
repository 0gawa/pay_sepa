"use client";

import { Link } from "@heroui/react";
import { useState } from 'react'
import Modal from "@/app/ui/modal";

export default function Header() {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 rounded-lg p-2 hover:bg-indigo-50 transition-colors">
          Just Pay
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="#" onPress={openModal} className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">使い方</Link>
              <Modal isOpen={isOpen} onClose={closeModal} title="このアプリの使い方">
                <div>
                  <h2 className="text-lg">1. 必要な情報をサッと登録</h2>
                  <p className="mt-2">「誰が」「誰に」「いくら支払ったか」を直感的に入力するだけ。複雑な操作は一切不要です。ランチ代から旅行の費用まで、どんなシーンの支払いも手間なく記録できます。</p>
                  <h2 className="mt-3 text-lg">2. 面倒な計算はアプリにお任せ</h2>
                  <p className="mt-2">入力された情報を基に、アプリが自動で<strong>最適な清算方法</strong>を瞬時に算出します。複雑な割り勘や複数人での立て替えも、もう大丈夫。手計算でのミスや手間から解放されます。</p>
                  <h2 className="mt-3 text-lg">3. 誰が誰にいくら払うか一目瞭然</h2>
                  <p className="mt-2">清算すべき金額が、「誰が」「誰に」「いくら」支払うべきか、リストで明確に表示されます。アプリの指示に従って支払うだけで、面倒な立て替えの回収も、スマートに完了します。</p>
                </div>
              </Modal>
            </li>
            <li><Link href="#balance" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">清算</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
