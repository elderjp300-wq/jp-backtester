import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, ChevronRight, BarChart2 } from 'lucide-react';
import { MOCK_STRATEGIES } from '../lib/mockData';
import RatingBadge from '../components/RatingBadge';
import TagChip from '../components/TagChip';
import BottomNav from '../components/BottomNav';

export default function EdgesPage() {
  const navigate = useNavigate();
  const passed = MOCK_STRATEGIES
    .filter(s => s.status === 'passed')
    .sort((a, b) => b.edge_score - a.edge_score);

  const avgSharpe = passed.reduce((s, st) =>
    s + (st.runs?.[0]?.sharpe ?? 0), 0) / Math.max(passed.length, 1);

  const edgeGroups = passed.reduce<Record<string, typeof passed>>((acc, s) => {
    const key = s.edge_type;
    acc[key] = [...(acc[key] ?? []), s];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-charcoal-950 pb-28">

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full
        bg-amber-950/10 blur-3xl pointer-events-none" />

      <header className="px-5 pt-12 pb-6 relative">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-amber-400" />
          <h1 className="text-xl font-bold text-charcoal-50">Your Edges</h1>
        </div>
        <p className="text-sm text-charcoal-400">Confirmed, passed strategies ranked by edge score.</p>

        {/* Stats bar */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Passed', value: passed.length, color: 'text-forest-300' },
            { label: 'Avg Sharpe', value: avgSharpe.toFixed(2), color: 'text-charcoal-200' },
            { label: 'Top Score', value: `${passed[0]?.edge_score ?? 0}`, color: 'text-amber-300' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-charcoal-850 border border-charcoal-700
              rounded-2xl px-3 py-3 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-charcoal-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="px-5 space-y-6 relative">

        {/* Ranked list */}
        <div>
          <h2 className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-4">
            Ranked by Edge Score
          </h2>

          <div className="space-y-2">
            {passed.map((s, i) => {
              const run = s.runs?.[0];
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/strategy/${s.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-4 bg-charcoal-850 border
                    border-charcoal-700 rounded-2xl hover:border-charcoal-600 transition-all
                    group text-left animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Rank */}
                  <div className={`flex-none w-10 h-10 rounded-xl flex items-center justify-center
                    font-bold text-sm border
                    ${i === 0 ? 'bg-amber-950/60 border-amber-800/50 text-amber-300' :
                      i === 1 ? 'bg-charcoal-800 border-charcoal-600 text-charcoal-200' :
                      i === 2 ? 'bg-charcoal-800 border-charcoal-600 text-charcoal-300' :
                      'bg-charcoal-900 border-charcoal-700 text-charcoal-500'}`}>
                    {i === 0 ? <Award size={16} /> : `#${i + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-charcoal-100 group-hover:text-white
                        transition-colors truncate">
                        {s.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags?.slice(0, 2).map(t => <TagChip key={t.id} tag={t} />)}
                    </div>
                  </div>

                  <div className="flex-none text-right space-y-1.5">
                    <RatingBadge rating={s.overall_rating} size="sm" />
                    <div className="flex items-center justify-end gap-1">
                      <BarChart2 size={11} className="text-amber-500" />
                      <span className="text-xs font-bold text-amber-300">{s.edge_score}</span>
                    </div>
                    {run && (
                      <p className="text-xs text-charcoal-500">{run.cagr?.toFixed(1)}% CAGR</p>
                    )}
                  </div>

                  <ChevronRight size={14} className="text-charcoal-600 group-hover:text-charcoal-400 transition-colors flex-none" />
                </button>
              );
            })}
          </div>
        </div>

        {/* By edge type */}
        <div>
          <h2 className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-4">
            By Edge Type
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(edgeGroups).map(([type, strats]) => {
              const avgScore = strats.reduce((s, st) => s + st.edge_score, 0) / strats.length;
              return (
                <div key={type}
                  className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-4
                    hover:border-charcoal-600 transition-all">
                  <p className="text-sm font-semibold text-charcoal-200 mb-1">{type}</p>
                  <p className="text-xs text-charcoal-500 mb-3">{strats.length} strategies</p>
                  <div className="h-1 bg-charcoal-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest-500 rounded-full transition-all"
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-forest-300 mt-1.5 font-medium">{avgScore.toFixed(0)} avg score</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
