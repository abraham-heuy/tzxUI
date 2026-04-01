import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Pools from '../components/sections/Pools';
import CTA from '../components/sections/CTA';
import Footer from '../components/layout/Footer';

// Import background image
import backgroundImage from '../assets/background.jpg';
import Disclaimer from '../components/sections/disclaimer';
import MaintenanceBanner from '../components/common/maintenanceBanner';

const LandingPage = () => {
  useScroll();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const poolsRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Pools', href: '#pools' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter,_sans-serif']">
      <Navbar navItems={navItems} />
      {/* Add padding top equal to navbar height to push content down */}
      <div className="pt-16">
        <MaintenanceBanner />
        <Hero ref={heroRef} backgroundImage={backgroundImage} />
        <Features ref={featuresRef} />
        <Pools ref={poolsRef} />
        <Disclaimer ref={disclaimerRef} />
        <CTA ref={ctaRef} />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;