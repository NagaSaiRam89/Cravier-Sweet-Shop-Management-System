
// Dynamically changes the menu options based on who is looking (Guest vs. Customer vs. Admin).

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Cart } from '@/components/Cart';
import { ThemeToggle } from '@/components/ThemeToggle';
// Icons
import { 
  Candy, 
  LogOut, 
  LayoutDashboard, 
  Shield,
  User,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
// Navbar component
export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl gradient-primary group-hover:scale-105 transition-transform">
              <Candy className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              Cravier
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                
                <Link to="/orders">
                  <Button 
                    variant={isActive('/orders') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Orders
                  </Button>
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant={isActive('/admin') ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            {user ? (
              <>
                {/* HIDE CART FOR ADMINS */}
                {!isAdmin && <Cart />}
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  {isAdmin && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                      Admin
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gradient-primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {/* HIDE CART FOR ADMINS (MOBILE) */}
            {user && !isAdmin && <Cart />}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      isActive('/dashboard') ? 'bg-secondary' : 'hover:bg-muted'
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      isActive('/orders') ? 'bg-secondary' : 'hover:bg-muted'
                    )}
                  >
                    <ClipboardList className="w-4 h-4" />
                    Orders
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg",
                        isActive('/admin') ? 'bg-secondary' : 'hover:bg-muted'
                      )}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-border/50 my-2" />
                  
                  <div className="flex items-center gap-2 px-4 py-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.name}</span>
                    {isAdmin && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button className="w-full gradient-primary">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}