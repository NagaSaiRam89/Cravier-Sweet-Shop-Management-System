
// Captures user credentials and performs initial checks before sending data to the server.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Candy, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();
// Define password requirements and their status
  const passwordRequirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Passwords match', met: password === confirmPassword && confirmPassword.length > 0 },
  ];
// Validate form inputs
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
   // Update error state 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await register({ name, email, password, confirmPassword });
      toast.success('Account created!', {
        description: 'Welcome to Sweet Shop.',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-pink relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-32 right-20 w-48 h-48 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-56 h-56 rounded-full bg-white/30 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-accent-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/30 backdrop-blur">
              <Candy className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">Cravier</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Join our sweet
            <br />
            community today
          </h2>
          
          <p className="text-lg opacity-90 max-w-md">
            Create an account and start exploring our collection of 
            artisan sweets and handcrafted treats.
          </p>

          <div className="mt-12 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-white/30">
                <Check className="w-4 h-4" />
              </div>
              <span>Browse premium sweets</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-white/30">
                <Check className="w-4 h-4" />
              </div>
              <span>Easy ordering process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-white/30">
                <Check className="w-4 h-4" />
              </div>
              <span>Track your favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-xl gradient-primary">
              <Candy className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Sweet Shop</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground mt-2">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`h-12 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 rounded-xl pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 rounded-xl ${errors.confirmPassword ? 'border-destructive' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-2 pt-2">
                {passwordRequirements.map((req) => (
                  <div 
                    key={req.label} 
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      req.met ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      req.met ? "bg-success" : "bg-muted"
                    )}>
                      {req.met && <Check className="w-3 h-3 text-success-foreground" />}
                    </div>
                    {req.label}
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gap-2 text-base mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
