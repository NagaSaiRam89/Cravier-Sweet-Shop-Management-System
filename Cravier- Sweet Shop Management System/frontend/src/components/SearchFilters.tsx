import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSweets } from '@/context/SweetContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SweetCategory } from '@/types/sweet';

export function SearchFilters() {
  const { filters, setFilters, resetFilters, categories } = useSweets();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({ search: searchValue });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchValue, setFilters]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setFilters({ minPrice: value[0], maxPrice: value[1] });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.minPrice > 0 || 
    filters.maxPrice < 100;

  const handleReset = () => {
    setSearchValue('');
    setPriceRange([0, 100]);
    resetFilters();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="icon"
          className="h-11 w-11 rounded-xl shrink-0"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ category: value as SweetCategory | 'all' })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Price Range</Label>
                <span className="text-sm font-medium text-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Active:</span>
              
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{filters.search}"
                  <button onClick={() => { setSearchValue(''); setFilters({ search: '' }); }}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.category}
                  <button onClick={() => setFilters({ category: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {(filters.minPrice > 0 || filters.maxPrice < 100) && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.minPrice} - ${filters.maxPrice}
                  <button onClick={() => { setPriceRange([0, 100]); setFilters({ minPrice: 0, maxPrice: 100 }); }}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-6 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
