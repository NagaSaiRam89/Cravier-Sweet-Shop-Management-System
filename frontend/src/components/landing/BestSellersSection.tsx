import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Heart } from 'lucide-react';

interface SweetCardProps {
  name: string;
  emoji: string;
  price: string;
  rating: number;
  reviews: number;
  tag?: string;
  delay: number;
}

const SweetCard = ({ name, emoji, price, rating, reviews, tag, delay }: SweetCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -8, rotate: 1 }}
      className="group relative bg-card rounded-3xl p-6 sweet-shadow hover:sweet-shadow-hover transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      </div>

      {/* Tag */}
      {tag && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-pink text-primary-foreground text-xs font-semibold">
          {tag}
        </div>
      )}

      {/* Heart button */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-pink transition-colors"
      >
        <Heart className="w-5 h-5" />
      </motion.button>

      {/* Emoji */}
      <motion.div 
        className="text-7xl mb-4 text-center"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        {emoji}
      </motion.div>

      {/* Info */}
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-caramel text-caramel" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="font-display text-2xl font-bold text-gradient-candy">
          {price}
        </div>
      </div>

      {/* Add to cart button - appears on hover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <button className="w-full py-3 rounded-2xl gradient-pink text-primary-foreground font-semibold text-sm hover:scale-[1.02] transition-transform">
          Add to Cart 🛒
        </button>
      </motion.div>
    </motion.div>
  );
};

export const BestSellersSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const sweets = [
    { name: 'Glazed Donut', emoji: '🍩', price: '$3.99', rating: 4.9, reviews: 128, tag: 'Best Seller' },
    { name: 'Chocolate Cupcake', emoji: '🧁', price: '$4.49', rating: 4.8, reviews: 96 },
    { name: 'Strawberry Macaron', emoji: '🍪', price: '$2.99', rating: 4.9, reviews: 214, tag: 'New' },
    { name: 'Belgian Chocolate', emoji: '🍫', price: '$5.99', rating: 4.7, reviews: 87 },
    { name: 'Rainbow Lollipop', emoji: '🍭', price: '$1.99', rating: 4.8, reviews: 156 },
    { name: 'Birthday Cake', emoji: '🎂', price: '$24.99', rating: 5.0, reviews: 43, tag: 'Premium' },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cream to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-pink/10 text-pink text-sm font-medium mb-4"
          >
            🍬 Fan Favorites
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Best Sellers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our most loved treats that keep customers coming back for more
          </p>
        </motion.div>

        {/* Sweet cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet, index) => (
            <SweetCard
              key={sweet.name}
              {...sweet}
              delay={0.1 * index}
            />
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <button className="group px-8 py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:border-pink/50 hover:sweet-shadow transition-all duration-300">
            View All Sweets
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellersSection;