import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, TrendingUp, CheckCircle, Clock, RefreshCw, ChevronRight,
  HardDrive, Zap, Award, Activity,
} from 'lucide-react';
import { MOCK_STRATEGIES, MOCK_STATS } from '../lib/mockData';
import StrategyCard from '../components/StrategyCard';
import BottomNav from '../components/BottomNav';

const SCAN_MESSAGES = [
  'Scanning Drive folder…',
  'Parsing CSV results…',
  'Extracting PNGs…',
  'Categorizing strategies…',
  'Import complete!',
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [scanDone, setScanDone] = useState(false);

  const recentStrategies = MOCK_STRATEGIES.slice(0, 3);
  const hotEdges = MOCK_STRATEGIES.filter(s => s.status === 'passed')
    .sort((a, b) => b.edge_score - a.edge_score)
    .slice(0, 3);

  const handleScan = async () => {
    setScanning(true);
    setScanDone(false);
    for (let i = 0; i < SCAN_MESSAGES.length; i++) {
      setScanMsg(SCAN_MESSAGES[i]);
      await new Promise(r => setTimeout(r, 900));
    }
    setScanning(false);
    setScanDone(true);
    setTimeout(() => setScanDone(false), 3000);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 pb-28">

      {/* Background glow */}
      <div className="absolute top-0 left-0 right-0 h-80 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/3 w-72 h-72 rounded-full bg-forest-900/15 blur-3xl" />
        <div className="absolute top-10 right-0 w-48 h-48 rounded-full bg-amber-950/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-600/50
              flex items-center justify-center">
              <BarChart2 size={18} className="text-forest-300" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-base font-bold text-charcoal-50 leading-tight">JP Backtester</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse-soft" />
                <span className="text-xs text-charcoal-500">Drive synced · 2m ago</span>
              </div>
            </div>
          </div>

          {/* Drive status pill */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-800 border border-charcoal-700
              rounded-full text-xs text-charcoal-300 hover:border-charcoal-600 transition-colors"
          >
            <HardDrive size={12} className="text-forest-400" />
            Connected
          </button>
        </div>

        <div className="mt-6">
          <p className="text-charcoal-400 text-sm">Welcome back, JP</p>
          <h2 className="text-2xl font-bold text-charcoal-50 mt-0.5">Your Edge Dashboard</h2>
        </div>
      </header>

      <div className="px-5 space-y-6 relative">

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: Activity,
              label: 'Strategies',
              value: MOCK_STATS.total_strategies,
              sub: 'total tracked',
              color: 'text-charcoal-200',
              bg: 'bg-charcoal-800',
              border: 'border-charcoal-700',
            },
            {
              icon: CheckCircle,
              label: 'Passed',
              value: MOCK_STATS.passed_count,
              sub: 'confirmed edges',
              color: 'text-forest-300',
              bg: 'bg-forest-900/40',
              border: 'border-forest-800/40',
            },
            {
              icon: TrendingUp,
              label: 'Avg Sharpe',
              value: MOCK_STATS.avg_sharpe.toFixed(2),
              sub: 'risk-adjusted',
              color: 'text-amber-300',
              bg: 'bg-amber-950/30',
              border: 'border-amber-900/40',
            },
            {
              icon: Award,
              label: 'Top Edge',
              value: `${MOCK_STATS.top_edge_score}`,
              sub: 'edge score',
              color: 'text-amber-300',
              bg: 'bg-amber-950/30',
              border: 'border-amber-900/40',
            },
          ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 animate-slide-up`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wide">{label}</span>
                <Icon size={16} className={`${color} opacity-60`} />
              </div>
              <p className={`text-3xl font-bold ${color} leading-none`}>{value}</p>
              <p className="text-xs text-charcoal-500 mt-1.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Scan Drive CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-forest-800/50 bg-forest-900/20
          p-5 animate-slide-up">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-forest-900/30 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-charcoal-100 mb-1">
                {scanDone ? 'Import complete!' : 'Scan for new backtests'}
              </h3>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                {scanning ? scanMsg : scanDone
                  ? '8 new strategies imported successfully.'
                  : 'Auto-import results from your Drive folder.'
                }
              </p>
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className={`flex-none ml-4 w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-200 active:scale-90 border
                ${scanDone
                  ? 'bg-forest-600 border-forest-500 text-white'
                  : 'bg-forest-500 hover:bg-forest-400 border-forest-400/50 text-white'
                }
                ${scanning ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {scanDone
                ? <CheckCircle size={22} />
                : <RefreshCw size={22} className={scanning ? 'animate-spin' : ''} />
              }
            </button>
          </div>
          {scanning && (
            <div className="mt-4 h-1 rounded-full bg-forest-900 overflow-hidden">
              <div className="h-full bg-forest-400 rounded-full animate-pulse-soft w-3/4 shimmer-bg" />
            </div>
          )}
        </div>

        {/* Hot Edges */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              <h3 className="font-semibold text-charcoal-100">Hot Edges</h3>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="text-xs text-forest-400 hover:text-forest-300 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {hotEdges.map((s, i) => (
              <button
                key={s.id}
                onClick={() => navigate(`/strategy/${s.id}`)}
                className="w-full flex items-center gap-4 px-4 py-3 bg-charcoal-850 border
                  border-charcoal-700 rounded-2xl hover:border-charcoal-600 transition-all group"
              >
                <div className="flex-none w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-900/50
                  flex items-center justify-center text-sm font-bold text-amber-300">
                  #{i + 1}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-charcoal-100 group-hover:text-white transition-colors">
                    {s.name}
                  </p>
                  <p className="text-xs text-charcoal-400">{s.edge_type} · {s.asset_class}</p>
                </div>
                <div className="flex-none text-right">
                  <p className="text-sm font-bold text-amber-300">{s.edge_score}</p>
                  <p className="text-xs text-charcoal-500">edge score</p>
                </div>
                <ChevronRight size={14} className="text-charcoal-600 group-hover:text-charcoal-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent strategies */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-charcoal-400" />
              <h3 className="font-semibold text-charcoal-100">Recently Updated</h3>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="text-xs text-forest-400 hover:text-forest-300 flex items-center gap-1 transition-colors"
            >
              Library <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentStrategies.map(s => (
              <StrategyCard key={s.id} strategy={s} viewMode="grid" />
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
