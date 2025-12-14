import { Navbar } from '@/components/Navbar';
import { SweetCard } from '@/components/SweetCard';
import { SearchFilters } from '@/components/SearchFilters';
import { SkeletonCard } from '@/components/Loader';
import { useSweets } from '@/context/SweetContext';
import { useAuth } from '@/context/AuthContext';
import { Package, TrendingUp, DollarSign, Candy } from 'lucide-react';

export default function Dashboard() {
  const { filteredSweets, sweets, isLoading } = useSweets();
  const { isAdmin } = useAuth();

  // Stats (only calculated for admin)
  const totalProducts = sweets.length;
  const inStock = sweets.filter(s => s.quantity > 0).length;
  const lowStock = sweets.filter(s => s.quantity > 0 && s.quantity <= 5).length;
  const totalValue = sweets.reduce((acc, s) => acc + s.price * s.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Browse our delicious collection of sweets
          </p>
        </div>

        {/* Stats Cards - Only visible to Admin */}
        {isAdmin && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-card sweet-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl gradient-primary">
                  <Candy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card sweet-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl gradient-mint">
                  <Package className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-foreground">{inStock}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card sweet-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-warning/20">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-foreground">{lowStock}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card sweet-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl gradient-pink">
                  <DollarSign className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">{totalValue.toFixed(0)}/-</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8">
          <SearchFilters />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No sweets found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
