
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const desserts = [
  { emoji: '🍩', name: 'Donuts' },
  { emoji: '🧁', name: 'Cupcakes' },
  { emoji: '🍫', name: 'Chocolates' },
  { emoji: '🍪', name: 'Cookies' },
  { emoji: '🍭', name: 'Lollipops' },
  { emoji: '🎂', name: 'Cakes' },
  { emoji: '🍰', name: 'Cheesecakes' },
  { emoji: '🍬', name: 'Candies' },
  { emoji: '🥧', name: 'Pies' },
  { emoji: '🧇', name: 'Waffles' },
  { emoji: '🍨', name: 'Ice Cream' },
  { emoji: '🥮', name: 'Mooncakes' },
];

const CarouselItem = ({ emoji, name }: { emoji: string; name: string }) => (
  <div
    className="flex-shrink-0 flex flex-col items-center gap-2 px-8 py-6 bg-card/50 backdrop-blur-sm rounded-2xl cursor-pointer hover:bg-card transition-colors group w-[180px]"
  >
    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
      {emoji}
    </span>
    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {name}
    </span>
  </div>
);

export const CravingsCarousel = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  // Double the items to create the seamless loop illusion
  const items = [...desserts, ...desserts];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-pink/5 to-background">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-2 rounded-full bg-caramel/10 text-caramel text-sm font-medium mb-4"
        >
          🤤 Satisfy Your Cravings
        </motion.span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
          What Are You Craving?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our delicious variety of sweet treats
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden mask-gradient">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Moving Left */}
        <div className="flex mb-8 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              ease: "linear", 
              duration: 30, // Adjust speed (higher = slower)
              repeat: Infinity 
            }}
            style={{ width: "max-content" }}
          >
            {items.map((item, index) => (
              <CarouselItem key={`row1-${index}`} emoji={item.emoji} name={item.name} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Moving Right */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              ease: "linear", 
              duration: 35, 
              repeat: Infinity 
            }}
            style={{ width: "max-content" }}
          >
            {items.map((item, index) => (
              <CarouselItem key={`row2-${index}`} emoji={item.emoji} name={item.name} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default CravingsCarousel;