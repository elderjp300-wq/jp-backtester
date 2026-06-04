import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, CheckCircle, Trash2, Download, ExternalLink,
  Copy, Check, BarChart2, Code2, FileText, Calendar,
  TrendingUp, Shield, Activity, Award,
} from 'lucide-react';
import { MOCK_STRATEGIES, MOCK_YEARLY_DATA, MOCK_PYTHON_CODE } from '../lib/mockData';
import { DetailTab } from '../types';
import PNGGallery from '../components/PNGGallery';
import RatingBadge from '../components/RatingBadge';
import StatusBadge from '../components/StatusBadge';
import TagChip from '../components/TagChip';
import BottomNav from '../components/BottomNav';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function heatClass(val: number | null): string {
  if (val === null) return 'heat-0 text-charcoal-600';
  if (val >= 5)  return 'heat-5 text-forest-50';
  if (val >= 3)  return 'heat-4 text-forest-100';
  if (val >= 1)  return 'heat-3 text-forest-200';
  if (val >= 0)  return 'heat-2 text-forest-300';
  if (val >= -3) return 'heat-n1 text-red-300';
  if (val >= -6) return 'heat-n2 text-red-200';
  return 'heat-n3 text-red-100';
}

function MetricRow({ label, value, sub, highlight = false }: {
  label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-charcoal-800/60 last:border-0">
      <span className="text-sm text-charcoal-400">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-semibold ${highlight ? 'text-forest-300' : 'text-charcoal-100'}`}>
          {value}
        </span>
        {sub && <p className="text-xs text-charcoal-500">{sub}</p>}
      </div>
    </div>
  );
}

function highlightPython(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#[^\n]*)/g, '<span class="code-comment">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="code-string">$1</span>')
    .replace(/\b(import|from|class|def|return|if|else|elif|for|while|in|not|and|or|True|False|None|self|async|await|with|as|try|except|raise|pass|lambda)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?(?:_\d+)*)\b/g, '<span class="code-number">$1</span>')
    .replace(/(@\w+)/g, '<span class="code-decorator">$1</span>');
}

export default function StrategyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const strategy = MOCK_STRATEGIES.find(s => s.id === id);

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [copied, setCopied] = useState(false);
  const [isFullyBt, setIsFullyBt] = useState(strategy?.is_fully_backtested ?? false);
  const [notes, setNotes] = useState(strategy?.notes ?? '');
  const [codeExpanded, setCodeExpanded] = useState(false);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal-400 mb-4">Strategy not found.</p>
          <button onClick={() => navigate(-1)} className="text-forest-400 text-sm">← Go back</button>
        </div>
      </div>
    );
  }

  const run = strategy.runs?.[0];
  const files = strategy.files ?? [];

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_PYTHON_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const TABS: { key: DetailTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview',   label: 'Overview',    icon: Activity },
    { key: 'statistics', label: 'Stats',        icon: BarChart2 },
    { key: 'yearly',     label: 'Year-by-Year', icon: Calendar },
    { key: 'code',       label: 'Code',         icon: Code2 },
    { key: 'notes',      label: 'Notes',        icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 pb-28">

      {/* Top bar */}
      <div className="sticky top-0 z-40 glass border-b border-charcoal-800/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-charcoal-400 hover:text-charcoal-200 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Library</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullyBt(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium
                transition-all duration-200
                ${isFullyBt
                  ? 'bg-forest-900/60 border-forest-700/50 text-forest-300'
                  : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400 hover:border-charcoal-600'
                }`}
            >
              <CheckCircle size={13} />
              {isFullyBt ? 'Fully BT\'d' : 'Mark Done'}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-charcoal-800
              border border-charcoal-700 text-charcoal-400 hover:text-red-400 hover:border-red-900/50
              transition-all">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="px-5 pt-6 pb-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl
            ${strategy.status === 'passed' ? 'bg-forest-900/20' : 'bg-amber-950/15'}`} />
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={strategy.status} />
                {isFullyBt && (
                  <span className="flex items-center gap-1 text-xs text-amber-300 bg-amber-950/50
                    border border-amber-900/50 px-2 py-0.5 rounded-full">
                    <Award size={11} /> Fully Backtested
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-charcoal-50 leading-tight mb-1">
                {strategy.name}
              </h1>
              <p className="text-sm text-charcoal-400 leading-relaxed">{strategy.description}</p>
            </div>
            <div className="flex-none">
              <RatingBadge rating={strategy.overall_rating} size="lg" />
            </div>
          </div>

          {/* Quick metrics */}
          {run && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1 mb-4">
              {[
                { label: 'CAGR',     value: `${run.cagr?.toFixed(1)}%`,   color: 'text-forest-300' },
                { label: 'Sharpe',   value: run.sharpe?.toFixed(2) ?? '—', color: 'text-charcoal-200' },
                { label: 'Win Rate', value: `${run.win_rate?.toFixed(1)}%`, color: 'text-charcoal-200' },
                { label: 'Max DD',   value: `${run.max_drawdown?.toFixed(1)}%`, color: 'text-red-400' },
                { label: 'Trades',   value: `${run.total_trades}`,          color: 'text-charcoal-200' },
              ].map(m => (
                <div key={m.label} className="flex-none flex flex-col items-center gap-0.5
                  px-4 py-3 bg-charcoal-850 border border-charcoal-700 rounded-2xl min-w-fit">
                  <span className={`text-base font-bold ${m.color}`}>{m.value}</span>
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wide">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {strategy.tags && strategy.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {strategy.tags.map(tag => <TagChip key={tag.id} tag={tag} />)}
            </div>
          )}
        </div>
      </div>

      {/* PNG Gallery */}
      {files.length > 0 && (
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-charcoal-200 flex items-center gap-2">
              <TrendingUp size={15} className="text-forest-400" />
              Charts · {files.filter(f => f.file_type === 'png').length} PNGs
            </h2>
          </div>
          <PNGGallery files={files} />
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 glass border-y border-charcoal-800/60 px-5 py-0">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium whitespace-nowrap
                border-b-2 transition-all duration-200
                ${activeTab === key
                  ? 'text-forest-300 border-forest-500'
                  : 'text-charcoal-500 border-transparent hover:text-charcoal-300'
                }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 py-5 animate-fade-in">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-charcoal-200 mb-4">Strategy Details</h3>
              <MetricRow label="Edge Type"    value={strategy.edge_type} />
              <MetricRow label="Asset Class"  value={strategy.asset_class} />
              <MetricRow label="Timeframe"    value={strategy.timeframe} />
              <MetricRow label="Edge Score"   value={`${strategy.edge_score}/100`} highlight />
              <MetricRow label="Status"       value={strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)} />
              {run && (
                <>
                  <MetricRow
                    label="Backtest Period"
                    value={`${run.start_date} → ${run.end_date}`}
                  />
                  <MetricRow label="Total Trades" value={`${run.total_trades}`} />
                </>
              )}
            </div>

            {run?.params_json && Object.keys(run.params_json).length > 0 && (
              <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-charcoal-200 mb-4">Parameters Tested</h3>
                {Object.entries(run.params_json).map(([k, v]) => (
                  <MetricRow key={k} label={k} value={String(v)} />
                ))}
              </div>
            )}

            {/* Export buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5
                bg-charcoal-800 border border-charcoal-700 rounded-2xl text-sm
                text-charcoal-300 hover:border-charcoal-600 hover:text-charcoal-100
                transition-all active:scale-95">
                <Download size={15} /> Export Package
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5
                bg-forest-900/40 border border-forest-800/50 rounded-2xl text-sm
                text-forest-300 hover:bg-forest-900/60 transition-all active:scale-95">
                <ExternalLink size={15} /> Open in Colab
              </button>
            </div>
          </div>
        )}

        {/* STATISTICS */}
        {activeTab === 'statistics' && run && (
          <div className="space-y-4">
            {[
              {
                title: 'Return Metrics',
                items: [
                  { label: 'CAGR',              value: `${run.cagr?.toFixed(2)}%`,     highlight: true },
                  { label: 'Profit Factor',      value: run.profit_factor?.toFixed(3) ?? '—' },
                  { label: 'Win Rate',           value: `${run.win_rate?.toFixed(2)}%` },
                  { label: 'Total Trades',       value: `${run.total_trades}` },
                ],
              },
              {
                title: 'Risk-Adjusted',
                items: [
                  { label: 'Sharpe Ratio',  value: run.sharpe?.toFixed(3) ?? '—',  highlight: true },
                  { label: 'Sortino Ratio', value: run.sortino?.toFixed(3) ?? '—' },
                  { label: 'Calmar Ratio',  value: run.calmar?.toFixed(3) ?? '—' },
                  { label: 'Max Drawdown',  value: `${run.max_drawdown?.toFixed(2)}%`, highlight: false },
                ],
              },
            ].map(section => (
              <div key={section.title} className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-charcoal-200 mb-4 flex items-center gap-2">
                  <Shield size={14} className="text-forest-400" />
                  {section.title}
                </h3>
                {section.items.map(item => (
                  <MetricRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    highlight={item.highlight}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* YEAR-BY-YEAR HEATMAP */}
        {activeTab === 'yearly' && (
          <div className="space-y-4">
            <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5 overflow-x-auto">
              <h3 className="text-sm font-semibold text-charcoal-200 mb-5 flex items-center gap-2">
                <Calendar size={14} className="text-amber-400" />
                Monthly Returns Heatmap
              </h3>

              <table className="w-full min-w-[520px] text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-charcoal-500 font-medium pb-3 pr-4 w-16">Year</th>
                    {MONTHS.map(m => (
                      <th key={m} className="text-center text-charcoal-500 font-medium pb-3 w-9">{m}</th>
                    ))}
                    <th className="text-right text-charcoal-500 font-medium pb-3 pl-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(MOCK_YEARLY_DATA).map(([year, months]) => {
                    const total = months.reduce<number>((s, v) => s + (v ?? 0), 0);
                    return (
                      <tr key={year}>
                        <td className="text-charcoal-300 font-semibold pr-4 py-1">{year}</td>
                        {months.map((val, i) => (
                          <td key={i} className="py-0.5 px-0.5">
                            <div className={`w-8 h-7 rounded flex items-center justify-center text-[10px]
                              font-medium transition-all hover:scale-110 cursor-default
                              ${heatClass(val)}`}>
                              {val !== null ? (val > 0 ? `+${val.toFixed(0)}` : val.toFixed(0)) : '—'}
                            </div>
                          </td>
                        ))}
                        <td className={`text-right font-semibold pl-3 text-xs
                          ${total >= 0 ? 'text-forest-300' : 'text-red-400'}`}>
                          {total >= 0 ? '+' : ''}{total.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-5">
                <span className="text-xs text-charcoal-500">Less</span>
                {[-1, 0, 1, 2, 3, 4, 5].map(v => (
                  <div key={v} className={`w-5 h-5 rounded ${heatClass(v < 0 ? v * 5 : v * 1.5)}`} />
                ))}
                <span className="text-xs text-charcoal-500">More</span>
              </div>
            </div>
          </div>
        )}

        {/* CODE */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl overflow-hidden">
              {/* Code toolbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-charcoal-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-forest-500/70" />
                  </div>
                  <span className="text-xs text-charcoal-500 ml-2 font-mono">strategy.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-800
                      border border-charcoal-700 text-xs text-charcoal-300 hover:border-charcoal-600
                      hover:text-charcoal-100 transition-all active:scale-95"
                  >
                    {copied ? <Check size={13} className="text-forest-400" /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                    bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-300
                    hover:border-charcoal-600 hover:text-charcoal-100 transition-all active:scale-95">
                    <Download size={13} /> .py
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                    bg-forest-900/40 border border-forest-800/50 text-xs text-forest-300
                    hover:bg-forest-900/60 transition-all active:scale-95">
                    <ExternalLink size={13} /> Colab
                  </button>
                </div>
              </div>

              {/* Code block */}
              <div className={`relative overflow-hidden transition-all duration-500
                ${codeExpanded ? 'max-h-none' : 'max-h-80'}`}>
                <pre className="p-5 text-xs leading-relaxed overflow-x-auto scrollbar-hide">
                  <code
                    className="font-mono text-charcoal-200"
                    dangerouslySetInnerHTML={{ __html: highlightPython(MOCK_PYTHON_CODE) }}
                  />
                </pre>
                {!codeExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t
                    from-charcoal-850 to-transparent flex items-end justify-center pb-3">
                    <button
                      onClick={() => setCodeExpanded(true)}
                      className="text-xs text-forest-400 hover:text-forest-300 transition-colors
                        bg-charcoal-850 px-4 py-1.5 rounded-full border border-charcoal-700"
                    >
                      Show full code
                    </button>
                  </div>
                )}
              </div>

              {codeExpanded && (
                <div className="px-5 pb-4 text-center">
                  <button
                    onClick={() => setCodeExpanded(false)}
                    className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors"
                  >
                    Collapse code ↑
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-charcoal-200 flex items-center gap-2">
                <FileText size={14} className="text-charcoal-400" />
                Personal Notes
              </h3>
              <span className="text-xs text-charcoal-600">Markdown supported</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add observations, ideas, next steps…

## What works
-

## What to test next
-

## Concerns
- "
              className="w-full h-72 px-5 py-4 bg-charcoal-850 border border-charcoal-700
                rounded-2xl text-sm text-charcoal-200 placeholder-charcoal-600
                focus:outline-none focus:border-forest-600 transition-all duration-200
                resize-none leading-relaxed font-mono"
            />
            <button className="w-full py-3.5 bg-forest-500 hover:bg-forest-400 text-white
              font-semibold rounded-2xl transition-all duration-200 active:scale-95 text-sm">
              Save Notes
            </button>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
