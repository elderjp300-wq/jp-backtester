import { Tag } from '../types';

interface TagChipProps {
  tag: Tag;
  size?: 'sm' | 'md';
  onRemove?: () => void;
}

export default function TagChip({ tag, size = 'sm', onRemove }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'}
      `}
      style={{
        color: tag.color,
        borderColor: `${tag.color}40`,
        backgroundColor: `${tag.color}14`,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
}
