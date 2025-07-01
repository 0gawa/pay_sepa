import FooterNavLink from '@/app/components/footer/footer-nav-link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto flex flex-col items-center">
        <nav className="mb-6 md:mb-4">
          <FooterNavLink />
        </nav>

        <div className="text-sm opacity-80 pt-4 border-t border-gray-700 w-full text-center"> {/* 上部にボーダーとパディングを追加 */}
          &copy; 2025 Just Pay
        </div>
      </div>
    </footer>
  );
}
