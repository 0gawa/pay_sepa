import Header from './ui/header';
import HeroSection from './components/ad/hero-section';
import FeaturesSection from './components/ad/key-feature-section';
import HowWorkSection from './components/ad/how-work-section';
import StartAppSection from './components/ad/start-app-section';
import Footer from './ui/footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowWorkSection />
        <StartAppSection />
      </main>
      <Footer />
    </>
  );
}
