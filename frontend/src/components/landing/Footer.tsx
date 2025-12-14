import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { useState } from 'react';

export const Footer = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <footer className="bg-card border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Main Content: Changed to Flex and Centered */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-12 w-full">
          
          {/* Brand - Centered */}
          <div className="flex flex-col items-center text-center max-w-sm">
            <motion.div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <motion.span
                className="text-3xl"
                animate={isLogoHovered ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                🍩
              </motion.span>
              <span className="font-display text-2xl font-bold text-foreground">Sweet Delights</span>
            </motion.div>
            <p className="text-muted-foreground mb-4">
              Handcrafted sweets made with love, delivering happiness one bite at a time.
            </p>
            <div className="flex gap-3 justify-center">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Facebook, label: 'Facebook' },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-pink hover:bg-pink/10 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links & Support (Commented Out as in source) */}
          {/* ... */}

          {/* Newsletter - Centered */}
          <div className="flex flex-col items-center text-center max-w-sm">
            <h4 className="font-display font-semibold text-foreground mb-4">Sweet Updates</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe for exclusive offers and sweet surprises!
            </p>
            <div className="flex gap-2 w-full">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink/50 text-center md:text-left"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl gradient-pink text-primary-foreground font-medium"
              >
                <Mail className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom - Centered */}
        <div className="w-full pt-8 border-t border-border flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Sweet Delights. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-pink fill-pink" /> and lots of sugar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;