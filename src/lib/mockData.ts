import { Strategy, DashboardStats } from '../types';

/* -------------------------------------------------------
   Chart images from Pexels — used as placeholder PNGs
   in the strategy gallery until real Drive files arrive.
------------------------------------------------------- */
const CHART_IMGS = [
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6801880/pexels-photo-6801880.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5849559/pexels-photo-5849559.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7567439/pexels-photo-7567439.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6801882/pexels-photo-6801882.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const PNG_LABELS = [
  'Equity Curve', 'Drawdown', 'Monthly Returns', 'Rolling Sharpe',
  'Trade Distribution', 'Win/Loss Ratio', 'Exposure Over Time',
  'Annual P&L Heatmap', 'Volatility Regime', 'Benchmark Comparison',
];

function makeFiles(stratId: string, count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${stratId}-file-${i}`,
    strategy_id: stratId,
    file_type: 'png' as const,
    file_name: `${PNG_LABELS[i]}.png`,
    file_url: CHART_IMGS[i % CHART_IMGS.length],
    display_label: PNG_LABELS[i],
    display_order: i,
  }));
}

function makeRun(stratId: string, overrides: Partial<{
  sharpe: number; sortino: number; calmar: number; win_rate: number;
  profit_factor: number; max_drawdown: number; cagr: number; total_trades: number;
}> = {}) {
  return [{
    id: `${stratId}-run-1`,
    strategy_id: stratId,
    run_label: 'Run 1',
    run_date: '2024-11-15',
    start_date: '2018-01-01',
    end_date: '2024-11-01',
    sharpe: overrides.sharpe ?? 1.82,
    sortino: overrides.sortino ?? 2.41,
    calmar: overrides.calmar ?? 0.93,
    win_rate: overrides.win_rate ?? 58.4,
    profit_factor: overrides.profit_factor ?? 1.74,
    max_drawdown: overrides.max_drawdown ?? -14.2,
    cagr: overrides.cagr ?? 22.1,
    total_trades: overrides.total_trades ?? 347,
    params_json: { rsi_period: 14, atr_mult: 2.0, lookback: 20 },
    notes: '',
  }];
}

export const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 'strat-001',
    name: 'RSI Mean Reversion ES',
    description: 'Mean reversion on S&P 500 futures using RSI oversold/overbought with ATR-based stops.',
    status: 'passed',
    overall_rating: 8.4,
    edge_type: 'Mean Reversion',
    asset_class: 'Futures',
    timeframe: 'Daily',
    edge_score: 84,
    is_fully_backtested: true,
    created_at: '2024-10-05T10:00:00Z',
    updated_at: '2024-11-15T14:30:00Z',
    tags: [
      { id: 't1', name: 'ES Futures', category: 'asset', color: '#3d8f52' },
      { id: 't2', name: 'Mean Reversion', category: 'logic', color: '#e08a1a' },
      { id: 't3', name: 'Daily', category: 'timeframe', color: '#5c666f' },
    ],
    runs: makeRun('strat-001', { sharpe: 1.82, win_rate: 58.4, cagr: 22.1, max_drawdown: -14.2 }),
    files: makeFiles('strat-001'),
    notes: '## Observations\n\nStrong mean reversion edge confirmed on 2018–2024 daily data.\n\n- Works best in high-VIX environments\n- Consider adding regime filter (200 SMA) to avoid trending markets\n- ATR multiplier of 2.0 gives best risk-adjusted returns\n\n## Next Steps\n- Walk-forward validation on 2024 OOS\n- Test on NQ and RTY for robustness\n',
    png_count: 10,
  },
  {
    id: 'strat-002',
    name: 'Momentum Breakout SPY',
    description: 'Dual momentum system on SPY with weekly rebalancing, absolute + relative momentum.',
    status: 'passed',
    overall_rating: 7.9,
    edge_type: 'Momentum',
    asset_class: 'ETF',
    timeframe: 'Weekly',
    edge_score: 79,
    is_fully_backtested: true,
    created_at: '2024-09-12T09:00:00Z',
    updated_at: '2024-11-10T11:00:00Z',
    tags: [
      { id: 't4', name: 'SPY', category: 'asset', color: '#3d8f52' },
      { id: 't5', name: 'Momentum', category: 'logic', color: '#e08a1a' },
      { id: 't6', name: 'Weekly', category: 'timeframe', color: '#5c666f' },
    ],
    runs: makeRun('strat-002', { sharpe: 1.55, win_rate: 62.1, cagr: 18.7, max_drawdown: -11.3 }),
    files: makeFiles('strat-002'),
    notes: '',
    png_count: 10,
  },
  {
    id: 'strat-003',
    name: 'Volatility Regime GLD',
    description: 'Long gold when realized vol crosses implied vol with position sizing based on VIX.',
    status: 'review',
    overall_rating: 6.2,
    edge_type: 'Vol Regime',
    asset_class: 'Commodities',
    timeframe: '4H',
    edge_score: 62,
    is_fully_backtested: false,
    created_at: '2024-11-01T08:00:00Z',
    updated_at: '2024-11-20T16:00:00Z',
    tags: [
      { id: 't7', name: 'GLD', category: 'asset', color: '#3d8f52' },
      { id: 't8', name: 'Volatility', category: 'logic', color: '#e08a1a' },
    ],
    runs: makeRun('strat-003', { sharpe: 0.91, win_rate: 51.2, cagr: 11.4, max_drawdown: -22.7 }),
    files: makeFiles('strat-003', 7),
    notes: '',
    png_count: 7,
  },
  {
    id: 'strat-004',
    name: 'Overnight Gap Fill NQ',
    description: 'Exploits overnight gaps in NQ futures that fill within first 30 minutes of session open.',
    status: 'passed',
    overall_rating: 9.1,
    edge_type: 'Gap Fill',
    asset_class: 'Futures',
    timeframe: '5min',
    edge_score: 91,
    is_fully_backtested: true,
    created_at: '2024-08-20T12:00:00Z',
    updated_at: '2024-11-18T09:45:00Z',
    tags: [
      { id: 't9', name: 'NQ Futures', category: 'asset', color: '#3d8f52' },
      { id: 't10', name: 'Gap Fill', category: 'logic', color: '#e08a1a' },
      { id: 't11', name: '5min', category: 'timeframe', color: '#5c666f' },
      { id: 't12', name: 'Intraday', category: 'logic', color: '#274e8c' },
    ],
    runs: makeRun('strat-004', { sharpe: 2.34, win_rate: 71.8, cagr: 34.5, max_drawdown: -8.9 }),
    files: makeFiles('strat-004'),
    notes: '',
    png_count: 10,
  },
  {
    id: 'strat-005',
    name: 'Cross-Asset Carry FX',
    description: 'Interest rate differential carry strategy across G10 FX pairs with vol-adjusted sizing.',
    status: 'review',
    overall_rating: 5.8,
    edge_type: 'Carry',
    asset_class: 'FX',
    timeframe: 'Daily',
    edge_score: 58,
    is_fully_backtested: false,
    created_at: '2024-11-10T14:00:00Z',
    updated_at: '2024-11-22T10:00:00Z',
    tags: [
      { id: 't13', name: 'FX', category: 'asset', color: '#3d8f52' },
      { id: 't14', name: 'Carry', category: 'logic', color: '#e08a1a' },
    ],
    runs: makeRun('strat-005', { sharpe: 0.72, win_rate: 48.3, cagr: 8.9, max_drawdown: -18.5 }),
    files: makeFiles('strat-005', 6),
    notes: '',
    png_count: 6,
  },
  {
    id: 'strat-006',
    name: 'Trend Following CTA-Style',
    description: 'Diversified trend following across 20 futures markets using ATR-channel breakouts.',
    status: 'passed',
    overall_rating: 8.7,
    edge_type: 'Trend',
    asset_class: 'Multi-Asset',
    timeframe: 'Daily',
    edge_score: 87,
    is_fully_backtested: true,
    created_at: '2024-07-15T08:00:00Z',
    updated_at: '2024-11-12T15:00:00Z',
    tags: [
      { id: 't15', name: 'Multi-Asset', category: 'asset', color: '#3d8f52' },
      { id: 't16', name: 'Trend', category: 'logic', color: '#e08a1a' },
      { id: 't17', name: 'CTA', category: 'logic', color: '#5c666f' },
    ],
    runs: makeRun('strat-006', { sharpe: 2.01, win_rate: 44.2, cagr: 28.3, max_drawdown: -16.1 }),
    files: makeFiles('strat-006'),
    notes: '',
    png_count: 10,
  },
  {
    id: 'strat-007',
    name: 'Earnings Drift Long Bias',
    description: 'Post-earnings announcement drift capturing 5-day momentum after positive surprises.',
    status: 'trash',
    overall_rating: 3.1,
    edge_type: 'Event-Driven',
    asset_class: 'Equities',
    timeframe: 'Daily',
    edge_score: 31,
    is_fully_backtested: false,
    created_at: '2024-11-05T11:00:00Z',
    updated_at: '2024-11-19T13:00:00Z',
    tags: [
      { id: 't18', name: 'Equities', category: 'asset', color: '#3d8f52' },
      { id: 't19', name: 'Event-Driven', category: 'logic', color: '#e08a1a' },
    ],
    runs: makeRun('strat-007', { sharpe: 0.31, win_rate: 42.1, cagr: 4.2, max_drawdown: -31.8 }),
    files: makeFiles('strat-007', 5),
    notes: '',
    png_count: 5,
  },
  {
    id: 'strat-008',
    name: 'Stat Arb Pairs QQQ/SPY',
    description: 'Statistical arbitrage on QQQ/SPY spread using cointegration and z-score entry signals.',
    status: 'passed',
    overall_rating: 7.6,
    edge_type: 'Stat Arb',
    asset_class: 'ETF',
    timeframe: 'Hourly',
    edge_score: 76,
    is_fully_backtested: true,
    created_at: '2024-10-18T09:00:00Z',
    updated_at: '2024-11-14T12:30:00Z',
    tags: [
      { id: 't20', name: 'QQQ/SPY', category: 'asset', color: '#3d8f52' },
      { id: 't21', name: 'Stat Arb', category: 'logic', color: '#e08a1a' },
      { id: 't22', name: 'Hourly', category: 'timeframe', color: '#5c666f' },
    ],
    runs: makeRun('strat-008', { sharpe: 1.69, win_rate: 60.7, cagr: 19.8, max_drawdown: -9.4 }),
    files: makeFiles('strat-008'),
    notes: '',
    png_count: 10,
  },
];

export const MOCK_STATS: DashboardStats = {
  total_strategies: MOCK_STRATEGIES.length,
  passed_count: MOCK_STRATEGIES.filter(s => s.status === 'passed').length,
  review_count: MOCK_STRATEGIES.filter(s => s.status === 'review').length,
  avg_win_rate: 56.2,
  avg_sharpe: 1.67,
  top_edge_score: 91,
};

export const MOCK_YEARLY_DATA: Record<string, (number | null)[]> = {
  '2018': [3.2, -1.4, 2.8, 4.1, -0.9, 1.2, 3.5, -2.1, 4.8, 2.3, -1.8, 5.2],
  '2019': [4.1, 2.9, 3.8, 1.2, -0.4, 5.1, 3.3, -1.9, 4.2, 2.8, 3.9, 5.8],
  '2020': [-8.2, 2.1, -12.4, 8.9, 6.2, 4.1, 5.8, 3.2, -2.1, 4.4, 7.3, 6.1],
  '2021': [4.8, 3.1, 2.9, 5.4, 1.8, -0.7, 4.2, 2.6, -1.3, 3.9, 5.1, 4.7],
  '2022': [-3.4, -2.1, 1.8, -4.2, -3.8, 2.4, -1.9, 3.2, -5.1, 4.8, 2.1, -0.8],
  '2023': [5.2, 2.8, 4.1, 3.9, 1.4, 4.8, 3.3, -1.2, 4.6, 2.9, 5.4, 6.1],
  '2024': [4.4, 2.1, 3.8, -0.9, 4.2, 3.5, 5.1, 2.8, 4.9, 3.1, null, null],
};

export const MOCK_PYTHON_CODE = `import pandas as pd
import numpy as np
from backtester import Backtester, Strategy

class RSIMeanReversion(Strategy):
    """
    RSI Mean Reversion on ES Futures
    Entry: RSI < 30 (oversold) with price above 200 SMA
    Exit:  RSI > 60 or ATR-based stop-loss
    """

    def __init__(self, rsi_period=14, atr_mult=2.0, lookback=200):
        self.rsi_period  = rsi_period
        self.atr_mult    = atr_mult
        self.lookback    = lookback

    def compute_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        df = data.copy()

        # RSI calculation
        delta = df['close'].diff()
        gain  = delta.clip(lower=0).rolling(self.rsi_period).mean()
        loss  = (-delta.clip(upper=0)).rolling(self.rsi_period).mean()
        rs    = gain / loss.replace(0, np.nan)
        df['rsi'] = 100 - (100 / (1 + rs))

        # ATR for stop sizing
        df['atr'] = self._atr(df, period=14)

        # Trend filter
        df['sma200'] = df['close'].rolling(self.lookback).mean()
        df['trend_up'] = df['close'] > df['sma200']

        # Entry / exit signals
        df['long_entry'] = (df['rsi'] < 30) & df['trend_up']
        df['long_exit']  = df['rsi'] > 60

        return df

    def _atr(self, df, period=14):
        high_low  = df['high'] - df['low']
        high_close = (df['high'] - df['close'].shift()).abs()
        low_close  = (df['low']  - df['close'].shift()).abs()
        tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
        return tr.rolling(period).mean()


# Run backtest
bt = Backtester(
    strategy=RSIMeanReversion(rsi_period=14, atr_mult=2.0),
    data_path='data/ES_daily.csv',
    initial_capital=100_000,
    commission=2.5,
    slippage=1.0,
)

results = bt.run()
results.plot_all()       # generates the 10 PNG outputs
results.export_json()    # exports full stats JSON
print(results.summary())
`;
