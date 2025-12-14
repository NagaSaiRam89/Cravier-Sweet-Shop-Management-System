import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FinalCTASection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-candy opacity-90" />
      
      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 left-[10%] text-6xl opacity-80"
      >
        🍩
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-[15%] text-5xl opacity-80"
      >
        🧁
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 left-[20%] text-5xl opacity-80"
      >
        🍬
      </motion.div>
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-20 right-[10%] text-6xl opacity-80"
      >
        🍭
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Sparkle badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Limited Time: Free Delivery on Orders Over $25</span>
            <span className="text-lg">🎁</span>
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Life is Short.
            <br />
            <span className="relative">
              Eat Dessert First.
              <motion.span
                className="absolute -right-8 top-0"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🍰
              </motion.span>
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto mb-10 font-body"
          >
            Don't let another day pass without treating yourself. Your taste buds deserve happiness.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
          >
            <Button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              size="lg"
              className="relative bg-white text-pink hover:bg-white/95 px-10 py-8 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <span className="flex items-center gap-3">
                Start Your Sweet Journey
                <motion.span
                  animate={isHovered ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-white/80"
          >
            <span className="flex items-center gap-1.5 text-sm">
              <span>✓</span> No subscription required
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1.5 text-sm">
              <span>✓</span> Satisfaction guaranteed
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1.5 text-sm">
              <span>✓</span> Free returns
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;