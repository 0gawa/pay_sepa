"use client";

import {
  Link,
  useDisclosure,
} from "@heroui/react";
import Modal from "@/app/ui/ad/how-to-use-modal";

export default function Header() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 rounded-lg p-2 hover:bg-indigo-50 transition-colors">
          Just Pay
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="#" onPress={onOpen} className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">使い方</Link>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}/>
            </li>
            <li><Link href="#balance" className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 transition-colors">清算</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
