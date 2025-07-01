import Header from '@/app/ui/ad/header';
import Footer from '@/app/ui/footer';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
        <main className="my-3">
          {children}
        </main>
      <Footer />
    </>
  );
}
