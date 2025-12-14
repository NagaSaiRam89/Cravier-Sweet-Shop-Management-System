import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  avatar: string;
  role: string;
  quote: string;
  rating: number;
  delay: number;
}

const TestimonialCard = ({ name, avatar, role, quote, rating, delay }: TestimonialCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className="relative bg-card rounded-3xl p-8 sweet-shadow hover:sweet-shadow-hover transition-all duration-300"
    >
      {/* Quote icon */}
      <div className="absolute -top-4 -left-2 w-12 h-12 rounded-full gradient-pink flex items-center justify-center">
        <Quote className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-caramel text-caramel" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground text-lg leading-relaxed mb-6 font-body">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="text-4xl">{avatar}</div>
        <div>
          <p className="font-display font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-pink/10 to-transparent rounded-tl-3xl rounded-br-3xl" />
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      role: 'Food Blogger',
      quote: 'These are hands down the best donuts I\'ve ever tasted! The glazing is perfect and they melt in your mouth. Absolutely divine!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      avatar: '👨‍🍳',
      role: 'Pastry Chef',
      quote: 'As a professional chef, I\'m incredibly impressed. The attention to detail and quality of ingredients is outstanding. A must-try!',
      rating: 5,
    },
    {
      name: 'Emily Rose',
      avatar: '👩‍🎨',
      role: 'Happy Customer',
      quote: 'Ordered a birthday cake and it exceeded all expectations! Not only was it stunning but it tasted even better. My kids were over the moon!',
      rating: 5,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-caramel/5 rounded-full blur-3xl" />

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
            className="inline-block px-4 py-2 rounded-full bg-lavender/20 text-lavender text-sm font-medium mb-4"
          >
            💬 Sweet Words
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy customers who've experienced the magic
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              delay={0.15 * index}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '50k+', label: 'Happy Customers', emoji: '😊' },
            { value: '4.9', label: 'Average Rating', emoji: '⭐' },
            { value: '100k+', label: 'Sweets Sold', emoji: '🍩' },
            { value: '5+', label: 'Years of Joy', emoji: '🎉' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <span className="text-3xl mb-2 block">{stat.emoji}</span>
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-candy mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;