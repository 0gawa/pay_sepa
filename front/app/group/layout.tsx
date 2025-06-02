export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <>
      {/* header*/}
      <main>{children}</main>
      {/*footer*/}
    </>
  );
}
