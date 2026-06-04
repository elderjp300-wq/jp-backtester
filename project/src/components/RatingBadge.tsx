
interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const color =
    rating >= 8 ? 'text-forest-300 bg-forest-900/60 border-forest-700/40' :
    rating >= 6 ? 'text-amber-300 bg-amber-950/60 border-amber-800/40' :
                  'text-red-400 bg-red-950/50 border-red-900/40';

  const dot =
    rating >= 8 ? 'bg-forest-400' :
    rating >= 6 ? 'bg-amber-400' :
                  'bg-red-500';

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${color} ${sizes[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {rating.toFixed(1)}
    </span>
  );
}
