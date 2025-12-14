import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Simple CSS-based Floating Component
const FloatingSweet = ({ 
  emoji, 
  x, 
  y, 
  size, 
  delay, 
}: { 
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}) => {
  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer select-none"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: 1, 
        y: [-10, 10, -10], // Simple up/down loop
        rotate: [-5, 5, -5] // Gentle wobble
      }}
      transition={{
        opacity: { delay, duration: 1 },
        y: { 
          duration: 3 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        rotate: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.2, rotate: 15 }}
    >
      <span className="drop-shadow-lg">{emoji}</span>
    </motion.div>
  );
};

// 2. Simple Rotating Background Element
const OrbitingDonut = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="w-[500px] h-[500px] border-[1px] border-foreground/20 rounded-full flex items-center justify-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-50">
          🍩
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-6xl opacity-50">
          🍪
        </div>
      </motion.div>
    </div>
  );
};

export const HeroSection = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const handleCTAClick = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      navigate('/login');
    }, 800);
  }, [navigate]);

  const brandName = 'CRAVIER';

  // Static positions - no more random generation on every render
  const floatingSweets = [
    { emoji: '🧁', x: 10, y: 20, size: 48, delay: 0 },
    { emoji: '🍫', x: 85, y: 25, size: 40, delay: 0.2 },
    { emoji: '🍪', x: 15, y: 70, size: 44, delay: 0.4 },
    { emoji: '🍭', x: 90, y: 65, size: 50, delay: 0.6 },
    { emoji: '🍰', x: 50, y: 15, size: 35, delay: 0.8 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream transition-colors duration-300">
      
      {/* 1. Static Gradient Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-caramel/10 rounded-full blur-[80px]" />
      </div>

      {/* 2. Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingSweets.map((sweet, i) => (
          <FloatingSweet key={i} {...sweet} />
        ))}
      </div>

      <OrbitingDonut />

      {/* 3. Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-5xl mx-auto text-center">
        
        {/* Brand Title - FIXED: Using standard CSS classes for color instead of Framer Motion */}
        <h1 className="relative font-display text-6xl sm:text-7xl md:text-9xl font-bold tracking-tight mb-6">
          {brandName.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block text-foreground hover:text-primary transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -10 }} 
              /* NOTE: removed 'color' from whileHover to prevent theme locking */
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-display italic mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Where cravings come alive
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="relative"
        >
          <button
            onClick={handleCTAClick}
            className="group relative px-10 py-5 text-xl font-bold text-white rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 gradient-pink group-hover:brightness-110 transition-all" />
            <span className="relative flex items-center gap-3">
              Crave Now 🍩
            </span>
          </button>

          {showConfetti && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: -20 }}
               className="absolute left-1/2 -translate-x-1/2 -top-16 whitespace-nowrap bg-white px-4 py-2 rounded-lg shadow-lg text-pink font-bold"
             >
               Sweet Choice! 🍬
             </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;