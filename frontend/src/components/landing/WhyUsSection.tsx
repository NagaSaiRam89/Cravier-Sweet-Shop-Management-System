import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Clock, Heart, Truck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard = ({ icon, emoji, title, description, color, delay }: FeatureCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="bg-card rounded-3xl p-8 h-full sweet-shadow hover:sweet-shadow-hover transition-all duration-300">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6`}
        >
          <span className="text-3xl">{emoji}</span>
        </motion.div>

        {/* Content */}
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {/* Decorative corner */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-20 rounded-bl-[4rem] rounded-tr-3xl -z-10 group-hover:opacity-30 transition-opacity`} />
      </div>
    </motion.div>
  );
};

export const WhyUsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      emoji: '🌿',
      title: 'Fresh Ingredients',
      description: 'We source only the finest, freshest ingredients from local farms and trusted suppliers.',
      color: 'bg-mint/20',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      emoji: '👨‍🍳',
      title: 'Handcrafted Daily',
      description: 'Every treat is lovingly prepared each morning by our expert pastry chefs.',
      color: 'bg-caramel/20',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      emoji: '💝',
      title: 'Made with Love',
      description: 'We pour our hearts into every creation, ensuring each bite brings pure joy.',
      color: 'bg-pink/20',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      emoji: '🚀',
      title: 'Swift Delivery',
      description: 'Enjoy same-day delivery to ensure your sweets arrive fresh and delicious.',
      color: 'bg-lavender/20',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-mint/10 rounded-full blur-3xl" />

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
            className="inline-block px-4 py-2 rounded-full bg-mint/10 text-secondary text-sm font-medium mb-4"
          >
            ✨ Why Choose Us
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Why You'll Love Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not just making sweets – we're creating moments of pure happiness
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={0.15 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;