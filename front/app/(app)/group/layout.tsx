"use client"

import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
