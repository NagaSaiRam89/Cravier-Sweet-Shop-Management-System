import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

// Component Imports
import HeroSection from '@/components/landing/HeroSection';
import WhyUsSection from '@/components/landing/WhyUsSection';
import CravingsCarousel from '@/components/landing/CravingsCarousel';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navbar } from '@/components/Navbar';

// --- 1. Internal Navbar Component ---
// (We keep this here so the landing page has its own special navbar)
const LandingNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none" // pointer-events-none allows clicking through empty space
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-card/80 backdrop-blur-xl rounded-2xl px-6 py-3 sweet-shadow border border-border/50 pointer-events-auto">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            🍩
          </motion.span>
          <span className="font-display text-xl font-bold text-foreground">Cravier</span>
        </motion.div>

        {/* Nav links - desktop */}
        <div className="hidden md:flex items-center gap-8">
          {['Menu', 'About', 'Locations'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="px-5 py-2.5 rounded-xl gradient-pink text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {isAuthenticated ? 'Dashboard' : 'Sign In'}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

// --- 2. Main Index Page ---
const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // --- Logic: Redirect if Logged In ---
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // --- Logic: Loading Spinner ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-pink/30 border-t-pink rounded-full animate-spin" />
      </div>
    );
  }

  // --- UI: The New Landing Page ---
  return (
    <div className="min-h-screen bg-background selection:bg-pink/20 overflow-x-hidden">
        {/* <LandingNavbar /> */}
        <Navbar />
        
        <main>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Trust Indicators */}
          <WhyUsSection />
          
          {/* Carousel  */}
          <CravingsCarousel />
          
          {/* Social Proof */}
          <TestimonialsSection />
          
          {/* Final CTA */}
          <FinalCTASection />
        </main>

        <Footer />
      </div>
  );
};

export default Index;