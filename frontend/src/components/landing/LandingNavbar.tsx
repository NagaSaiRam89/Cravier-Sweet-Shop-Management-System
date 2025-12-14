import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-card/80 backdrop-blur-xl rounded-2xl px-6 py-3 sweet-shadow border border-border/50">
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
          <span className="font-display text-xl font-bold text-foreground">Sweet Delights</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Menu', 'About', 'Locations'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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