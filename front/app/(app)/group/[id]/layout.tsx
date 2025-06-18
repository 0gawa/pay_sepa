export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </>
  );
}
