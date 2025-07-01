"use client";

import Link from 'next/link';

export default function FooterNavLink() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
      <li>
        <Link href="/algorithm-description" className="hover:text-blue-400 transition-colors duration-200">
          アルゴリズムについて
        </Link>
      </li>
      <li>
        <Link href="/contact" className="hover:text-blue-400 transition-colors duration-200">
          お問い合わせ
        </Link>
      </li>
      <li>
        <Link href="/about-developer" className="hover:text-blue-400 transition-colors duration-200">
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
