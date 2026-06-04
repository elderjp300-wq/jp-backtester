import { StrategyStatus } from '../types';

interface StatusBadgeProps {
  status: StrategyStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = {
    passed: {
      label: 'Passed',
      class: 'bg-forest-900/70 text-forest-200 border-forest-700/50',
      dot: 'bg-forest-400',
    },
    review: {
      label: 'In Review',
      class: 'bg-amber-950/70 text-amber-200 border-amber-800/50',
      dot: 'bg-amber-400',
    },
    trash: {
      label: 'Trashed',
      class: 'bg-charcoal-800 text-charcoal-300 border-charcoal-600',
      dot: 'bg-charcoal-500',
    },
  };

  const { label, class: cls, dot } = config[status];
  const sz = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cls} ${sz}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
