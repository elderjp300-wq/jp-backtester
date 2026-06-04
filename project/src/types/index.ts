export type StrategyStatus = 'passed' | 'review' | 'trash';

export interface Tag {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface StrategyFile {
  id: string;
  strategy_id: string;
  run_id?: string;
  file_type: 'png' | 'csv' | 'json' | 'other';
  file_name: string;
  file_url: string;
  display_label: string;
  display_order: number;
}

export interface BacktestRun {
  id: string;
  strategy_id: string;
  run_label: string;
  run_date: string;
  sharpe?: number;
  sortino?: number;
  calmar?: number;
  win_rate?: number;
  profit_factor?: number;
  max_drawdown?: number;
  cagr?: number;
  total_trades?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
  params_json?: Record<string, unknown>;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: StrategyStatus;
  overall_rating: number;
  edge_type: string;
  asset_class: string;
  timeframe: string;
  edge_score: number;
  is_fully_backtested: boolean;
  drive_folder_id?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  runs?: BacktestRun[];
  files?: StrategyFile[];
  notes?: string;
  png_count?: number;
}

export interface DashboardStats {
  total_strategies: number;
  passed_count: number;
  review_count: number;
  avg_win_rate: number;
  avg_sharpe: number;
  top_edge_score: number;
}

export type ViewMode = 'grid' | 'list';
export type FilterTab = 'all' | 'passed' | 'review' | 'trash';
export type DetailTab = 'overview' | 'statistics' | 'yearly' | 'code' | 'notes';
