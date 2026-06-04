import { useState, useMemo } from 'react';
import { Search, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { MOCK_STRATEGIES } from '../lib/mockData';
import { FilterTab, ViewMode } from '../types';
import StrategyCard from '../components/StrategyCard';
import BottomNav from '../components/BottomNav';

const FILTER_TABS: { key: FilterTab; label: string; color: string }[] = [
  { key: 'all',     label: 'All',       color: 'text-charcoal-200' },
  { key: 'passed',  label: 'Passed',    color: 'text-forest-300' },
  { key: 'review',  label: 'In Review', color: 'text-amber-300' },
  { key: 'trash',   label: 'Trash',     color: 'text-charcoal-500' },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedEdge, setSelectedEdge] = useState('');

  const assetClasses = [...new Set(MOCK_STRATEGIES.map(s => s.asset_class))];
  const edgeTypes    = [...new Set(MOCK_STRATEGIES.map(s => s.edge_type))];

  const filtered = useMemo(() => {
    return MOCK_STRATEGIES.filter(s => {
      if (filter !== 'all' && s.status !== filter) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) &&
          !s.edge_type.toLowerCase().includes(query.toLowerCase()) &&
          !s.asset_class.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedAsset && s.asset_class !== selectedAsset) return false;
      if (selectedEdge && s.edge_type !== selectedEdge) return false;
      return true;
    });
  }, [filter, query, selectedAsset, selectedEdge]);

  const counts = useMemo(() => ({
    all:     MOCK_STRATEGIES.length,
    passed:  MOCK_STRATEGIES.filter(s => s.status === 'passed').length,
    review:  MOCK_STRATEGIES.filter(s => s.status === 'review').length,
    trash:   MOCK_STRATEGIES.filter(s => s.status === 'trash').length,
  }), []);

  const hasActiveFilters = selectedAsset || selectedEdge;

  return (
    <div className="min-h-screen bg-charcoal-950 pb-28">

      {/* Header */}
      <header className="px-5 pt-12 pb-4 sticky top-0 z-30 glass border-b border-charcoal-800/60">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-charcoal-50">Strategy Library</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700
                flex items-center justify-center text-charcoal-400 hover:text-charcoal-200
                hover:border-charcoal-600 transition-all"
            >
              {viewMode === 'grid' ? <List size={17} /> : <Grid size={17} />}
            </button>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center
                transition-all relative
                ${showFilters || hasActiveFilters
                  ? 'bg-forest-800 border-forest-700 text-forest-300'
                  : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-600'
                }`}
            >
              <SlidersHorizontal size={17} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search strategies, edges, assets…"
            className="w-full pl-11 pr-10 py-3 bg-charcoal-800 border border-charcoal-700
              rounded-2xl text-sm text-charcoal-100 placeholder-charcoal-600
              focus:outline-none focus:border-forest-600 transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-500
                hover:text-charcoal-300 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {FILTER_TABS.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs
                font-medium transition-all duration-200
                ${filter === key
                  ? `bg-charcoal-750 border border-charcoal-600 ${color}`
                  : 'text-charcoal-500 hover:text-charcoal-300'
                }`}
            >
              {label}
              <span className={`text-[10px] ${filter === key ? 'opacity-70' : 'opacity-40'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2 animate-slide-up">
            <select
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
              className="flex-1 min-w-28 py-2 px-3 bg-charcoal-800 border border-charcoal-700
                rounded-xl text-xs text-charcoal-200 focus:outline-none focus:border-forest-600
                transition-all"
            >
              <option value="">All Assets</option>
              {assetClasses.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select
              value={selectedEdge}
              onChange={e => setSelectedEdge(e.target.value)}
              className="flex-1 min-w-28 py-2 px-3 bg-charcoal-800 border border-charcoal-700
                rounded-xl text-xs text-charcoal-200 focus:outline-none focus:border-forest-600
                transition-all"
            >
              <option value="">All Edge Types</option>
              {edgeTypes.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => { setSelectedAsset(''); setSelectedEdge(''); }}
                className="px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded-xl
                  text-xs text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-600
                  transition-all flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}
      </header>

      {/* Results */}
      <div className="px-5 py-4">
        <p className="text-xs text-charcoal-500 mb-4">
          {filtered.length} {filtered.length === 1 ? 'strategy' : 'strategies'}
          {query ? ` matching "${query}"` : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-charcoal-850 border border-charcoal-700
              flex items-center justify-center mb-4">
              <Search size={24} className="text-charcoal-600" />
            </div>
            <p className="font-semibold text-charcoal-300 mb-1">No strategies found</p>
            <p className="text-sm text-charcoal-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            : 'flex flex-col gap-2'
          }>
            {filtered.map((s, i) => (
              <StrategyCard
                key={s.id}
                strategy={s}
                viewMode={viewMode}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
