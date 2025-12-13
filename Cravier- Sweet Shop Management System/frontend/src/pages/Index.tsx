import React, { useEffect, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Candy, ArrowRight, Sparkles, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ---------------- Dashboard Lazy Load ---------------- */
const Dashboard = React.lazy(() => import('./Dashboard'));

/* ---------------- Main Index ---------------- */
const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  /* Redirect authenticated users */
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  /* Loader */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-pink/30 border-t-pink rounded-full animate-spin" />
      </div>
    );
  }

  /* Landing page (non-auth users) */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* ---------------- Hero Section ---------------- */}
        <section className="relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-mint/20 rounded-full blur-3xl" />
            <div className="absolute top-40 right-40 w-48 h-48 bg-caramel/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 border mb-8">
                <Sparkles className="h-4 w-4 text-caramel" />
                <span className="text-sm font-medium text-muted-foreground">
                  Handcrafted with love
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Indulge in Sweet
                <span className="text-gradient-candy block">Perfection</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Discover artisanal sweets, chocolates & confections.
                Every bite is pure delight.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button className="btn-candy h-14 px-8 text-lg group">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/login">
                  <Button variant="outline" className="h-14 px-8 text-lg border-2">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating icons */}
            <Floating icon="🍫" className="left-10 top-1/2" delay="0s" />
            <Floating icon="🍬" className="right-20 top-1/3" delay="0.5s" />
            <Floating icon="🍪" className="left-1/4 bottom-20" delay="1s" />
            <Floating icon="🍰" className="right-1/4 bottom-32" delay="1.5s" />
          </div>
        </section>

        {/* ---------------- Features ---------------- */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-4xl font-bold text-center mb-16">
              Why Choose Cravier Sweet Shop?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard
                icon={Candy}
                title="Premium Quality"
                description="Only the finest ingredients from trusted suppliers."
                color="pink"
              />
              <FeatureCard
                icon={ShoppingBag}
                title="Easy Ordering"
                description="Browse and order your favorites in seconds."
                color="mint"
              />
              <FeatureCard
                icon={Shield}
                title="Fresh Guarantee"
                description="Prepared fresh and delivered with care."
                color="caramel"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink to-caramel">
              <Candy className="h-5 w-5 text-chocolate" />
            </div>
            <span className="font-display text-lg font-semibold">
            Cravier
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 Cravier — Made with 💖
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

/* ---------------- Floating Emoji ---------------- */
const Floating = ({
  icon,
  className,
  delay,
}: {
  icon: string;
  className: string;
  delay: string;
}) => (
  <div
    className={`absolute text-5xl animate-float hidden lg:block ${className}`}
    style={{ animationDelay: delay }}
  >
    {icon}
  </div>
);

/* ---------------- Feature Card ---------------- */
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: 'pink' | 'mint' | 'caramel';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
}) => {
  const colors = {
    pink: 'bg-pink/20 text-pink border-pink/30',
    mint: 'bg-mint/20 text-mint border-mint/30',
    caramel: 'bg-caramel/20 text-caramel border-caramel/30',
  };

  return (
    <div className="card-sweet p-8 border bg-gradient-to-br transition hover:shadow-lg">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
