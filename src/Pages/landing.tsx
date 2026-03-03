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

const LandingPage = () => {
  useScroll();
  
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const poolsRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null); // Add ref
  const ctaRef = useRef<HTMLDivElement>(null);

  // Navigation items
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
      <Hero ref={heroRef} backgroundImage={backgroundImage} />
      <Features ref={featuresRef} />
      <Pools ref={poolsRef} />
      <Disclaimer ref={disclaimerRef} />
      <CTA ref={ctaRef} />
      <Footer />
    </div>
  );
};

export default LandingPage;