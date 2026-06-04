import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Strategy } from '../types';
import RatingBadge from './RatingBadge';
import StatusBadge from './StatusBadge';
import TagChip from './TagChip';
import { Image, Calendar, ChevronRight } from 'lucide-react';

interface StrategyCardProps {
  strategy: Strategy;
  viewMode?: 'grid' | 'list';
  style?: React.CSSProperties;
}

export default function StrategyCard({ strategy, viewMode = 'grid', style }: StrategyCardProps) {
  const navigate = useNavigate();

  const lastRun = strategy.runs?.[0];
  const date = new Date(strategy.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  if (viewMode === 'list') {
    return (
      <button
        onClick={() => navigate(`/strategy/${strategy.id}`)}
        style={style}
        className="w-full flex items-center gap-4 px-4 py-3.5 bg-charcoal-850 border
          border-charcoal-700 rounded-2xl hover:border-charcoal-600 hover:bg-charcoal-800
          transition-all duration-200 text-left group animate-fade-in"
      >
        {/* Rating ring */}
        <div className="flex-none w-12 h-12 rounded-xl bg-charcoal-800 border border-charcoal-700
          flex items-center justify-center group-hover:border-forest-700/50 transition-colors">
          <span className={`text-lg font-bold
            ${strategy.overall_rating >= 8 ? 'text-forest-300' :
              strategy.overall_rating >= 6 ? 'text-amber-300' : 'text-red-400'}`}>
            {strategy.overall_rating.toFixed(1)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-charcoal-100 text-sm truncate">{strategy.name}</span>
            <StatusBadge status={strategy.status} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-xs text-charcoal-400">
            <span>{strategy.edge_type}</span>
            <span>·</span>
            <span>{strategy.asset_class}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Image size={11} />
              {strategy.png_count ?? 0}
            </span>
          </div>
        </div>

        <div className="flex-none flex flex-col items-end gap-1.5">
          <span className="text-xs text-charcoal-500">{date}</span>
          {lastRun && (
            <span className="text-xs text-charcoal-300 font-mono">
              W {lastRun.win_rate?.toFixed(0)}%
            </span>
          )}
          <ChevronRight size={14} className="text-charcoal-600 group-hover:text-charcoal-400 transition-colors" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/strategy/${strategy.id}`)}
      style={style}
      className="w-full flex flex-col bg-charcoal-850 border border-charcoal-700 rounded-2xl
        overflow-hidden hover:border-charcoal-600 hover:bg-charcoal-800 transition-all duration-200
        text-left group hover:shadow-xl hover:shadow-charcoal-950/50 animate-fade-in"
    >
      {/* Top accent bar */}
      <div className={`h-0.5 w-full
        ${strategy.status === 'passed' ? 'bg-gradient-to-r from-forest-600 to-forest-400' :
          strategy.status === 'review' ? 'bg-gradient-to-r from-amber-700 to-amber-500' :
          'bg-charcoal-700'}`}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-charcoal-100 text-sm leading-tight truncate group-hover:text-white transition-colors">
              {strategy.name}
            </h3>
            <p className="text-xs text-charcoal-400 mt-0.5">{strategy.edge_type} · {strategy.timeframe}</p>
          </div>
          <RatingBadge rating={strategy.overall_rating} size="sm" />
        </div>

        {/* Tags */}
        {strategy.tags && strategy.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {strategy.tags.slice(0, 3).map(tag => (
              <TagChip key={tag.id} tag={tag} size="sm" />
            ))}
            {strategy.tags.length > 3 && (
              <span className="text-xs text-charcoal-500">+{strategy.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats row */}
        {lastRun && (
          <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-charcoal-900/60 border border-charcoal-700/50 mb-3">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wide">Win</span>
              <span className="text-xs font-semibold text-charcoal-200">{lastRun.win_rate?.toFixed(0)}%</span>
            </div>
            <div className="w-px h-6 bg-charcoal-700" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wide">Sharpe</span>
              <span className="text-xs font-semibold text-charcoal-200">{lastRun.sharpe?.toFixed(2)}</span>
            </div>
            <div className="w-px h-6 bg-charcoal-700" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wide">CAGR</span>
              <span className="text-xs font-semibold text-forest-300">{lastRun.cagr?.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <StatusBadge status={strategy.status} size="sm" />
          <div className="flex items-center gap-2 text-xs text-charcoal-500">
            <span className="flex items-center gap-1">
              <Image size={11} />
              {strategy.png_count ?? 0}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {date}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
