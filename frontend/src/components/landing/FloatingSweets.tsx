import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingSweetProps {
  emoji: string;
  initialX: number;
  initialY: number;
  size: number;
  delay: number;
  duration: number;
}

const FloatingSweet = ({ emoji, initialX, initialY, size, delay, duration }: FloatingSweetProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer select-none hover-wiggle"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        fontSize: size,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -20, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5, type: 'spring' },
        y: { delay: delay + 0.5, duration, repeat: Infinity, ease: 'easeInOut' },
        rotate: { delay: delay + 0.5, duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ 
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.4 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <span className={`drop-shadow-lg ${isHovered ? 'candy-glow' : ''}`}>
        {emoji}
      </span>
    </motion.div>
  );
};

const Sprinkle = ({ delay, left }: { delay: number; left: number }) => {
  const colors = ['bg-pink', 'bg-mint', 'bg-caramel', 'bg-strawberry', 'bg-lavender'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className={`absolute w-1.5 h-4 rounded-full ${color}`}
      style={{ left: `${left}%`, top: -20 }}
      initial={{ opacity: 0, y: -20, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, window.innerHeight + 100],
        rotate: 360,
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export const FloatingSweets = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 50, stiffness: 100 };
  const parallaxX = useSpring(useTransform(mouseX, [0, window.innerWidth], [-30, 30]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [0, window.innerHeight], [-30, 30]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const sweets = [
    { emoji: '🍩', x: 5, y: 15, size: 60, delay: 0, duration: 4 },
    { emoji: '🧁', x: 85, y: 20, size: 55, delay: 0.3, duration: 5 },
    { emoji: '🍫', x: 15, y: 60, size: 45, delay: 0.6, duration: 4.5 },
    { emoji: '🍪', x: 90, y: 65, size: 50, delay: 0.9, duration: 5.5 },
    { emoji: '🍭', x: 8, y: 85, size: 48, delay: 1.2, duration: 4.2 },
    { emoji: '🎂', x: 92, y: 85, size: 52, delay: 1.5, duration: 5.2 },
    { emoji: '🍬', x: 75, y: 10, size: 40, delay: 0.4, duration: 4.8 },
    { emoji: '🍰', x: 20, y: 35, size: 42, delay: 0.7, duration: 5.3 },
  ];

  const sprinkles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.5,
    left: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sprinkles falling */}
      {sprinkles.map((sprinkle, i) => (
        <Sprinkle key={i} delay={sprinkle.delay} left={sprinkle.left} />
      ))}
      
      {/* Floating sweets with parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-auto"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {sweets.map((sweet, i) => (
          <FloatingSweet
            key={i}
            emoji={sweet.emoji}
            initialX={sweet.x}
            initialY={sweet.y}
            size={sweet.size}
            delay={sweet.delay}
            duration={sweet.duration}
          />
        ))}
      </motion.div>

      {/* Rolling donut */}
      <motion.div
        className="absolute bottom-20 text-7xl"
        initial={{ x: '-100%', rotate: 0 }}
        animate={{ x: '100vw', rotate: 720 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        🍩
      </motion.div>
    </div>
  );
};

export default FloatingSweets;