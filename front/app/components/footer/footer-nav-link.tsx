"use client";

import Link from 'next/link';

export default function FooterNavLink() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
      <li>
        <Link href="/balance-algorithm" className="hover:text-blue-400 transition-colors duration-200">
          アルゴリズムについて
        </Link>
      </li>
      <li>
        <Link href="https://forms.gle/HnNA5mFasNaBCU63A" className="hover:text-blue-400 transition-colors duration-200">
          お問い合わせ
        </Link>
      </li>
      <li>
        <Link href="/me" className="hover:text-blue-400 transition-colors duration-200">
          製作者情報
        </Link>
      </li>
      <li>
        <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
        プライバシーポリシー
        </Link>
      </li>
    </ul>
  );
}
