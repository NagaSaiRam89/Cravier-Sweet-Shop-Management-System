import { cn } from '@/lib/utils';
import { Candy } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Candy 
        className={cn(
          sizeClasses[size],
          'text-primary animate-spin'
        )} 
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card p-4 sweet-shadow animate-pulse">
      <div className="aspect-square rounded-xl bg-muted mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded-lg w-3/4" />
        <div className="h-3 bg-muted rounded-lg w-1/2" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-muted rounded-lg w-20" />
          <div className="h-10 bg-muted rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}
