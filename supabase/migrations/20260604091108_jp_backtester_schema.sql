/*
  # JP Backtester Schema

  ## Summary
  Creates the full data model for the JP Backtester app — a personal quant trading backtest
  management platform. Stores strategies, backtest runs, attached files (PNGs/CSVs), notes,
  and tags.

  ## New Tables

  ### strategies
  Master record for a unique trading strategy/logic. Each strategy can have multiple
  backtest runs representing different parameter sets or time periods.
  - id, name, description, status (passed/review/trash), overall_rating (1-10),
    edge_type, asset_class, timeframe, created_at, updated_at, drive_folder_id,
    is_fully_backtested, edge_score

  ### backtest_runs
  Individual backtest execution results linked to a strategy. Holds all quant metrics.
  - id, strategy_id, run_label, run_date, sharpe, sortino, calmar, win_rate,
    profit_factor, max_drawdown, cagr, total_trades, start_date, end_date,
    notes, params_json, created_at

  ### strategy_files
  PNGs, CSVs, JSON results attached to a backtest run.
  - id, run_id, strategy_id, file_type (png/csv/json), file_name, file_url,
    display_label, display_order, drive_file_id, created_at

  ### strategy_notes
  Personal markdown notes for a strategy.
  - id, strategy_id, content, created_at, updated_at

  ### tags
  Reusable tags (asset class, logic type, timeframe, etc.)
  - id, name, category, color

  ### strategy_tags
  Many-to-many join between strategies and tags.
  - strategy_id, tag_id

  ## Security
  - RLS enabled on all tables
  - All policies require authenticated user
  - user_id column ties all records to the owner

  ## Notes
  - Indexes on strategy_id FK columns for query performance
  - status enum enforced via check constraint
  - file_type enum enforced via check constraint
*/

-- ----------------------------------------------------------------
-- STRATEGIES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS strategies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text DEFAULT '',
  status        text NOT NULL DEFAULT 'review'
                  CHECK (status IN ('passed', 'review', 'trash')),
  overall_rating  numeric(4,2) CHECK (overall_rating >= 0 AND overall_rating <= 10),
  edge_type     text DEFAULT '',
  asset_class   text DEFAULT '',
  timeframe     text DEFAULT '',
  edge_score    numeric(5,2) DEFAULT 0,
  is_fully_backtested boolean DEFAULT false,
  drive_folder_id text DEFAULT '',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own strategies"
  ON strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategies"
  ON strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategies"
  ON strategies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategies"
  ON strategies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- BACKTEST RUNS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS backtest_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id   uuid NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_label     text DEFAULT 'Run 1',
  run_date      date DEFAULT CURRENT_DATE,
  sharpe        numeric(6,3),
  sortino       numeric(6,3),
  calmar        numeric(6,3),
  win_rate      numeric(5,2),
  profit_factor numeric(6,3),
  max_drawdown  numeric(6,2),
  cagr          numeric(6,2),
  total_trades  integer DEFAULT 0,
  start_date    date,
  end_date      date,
  notes         text DEFAULT '',
  params_json   jsonb DEFAULT '{}',
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS backtest_runs_strategy_id_idx ON backtest_runs(strategy_id);

ALTER TABLE backtest_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own backtest runs"
  ON backtest_runs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own backtest runs"
  ON backtest_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backtest runs"
  ON backtest_runs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own backtest runs"
  ON backtest_runs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- STRATEGY FILES (PNGs, CSVs, JSONs)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS strategy_files (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id     uuid NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  run_id          uuid REFERENCES backtest_runs(id) ON DELETE SET NULL,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_type       text NOT NULL DEFAULT 'png'
                    CHECK (file_type IN ('png', 'csv', 'json', 'other')),
  file_name       text NOT NULL,
  file_url        text DEFAULT '',
  display_label   text DEFAULT '',
  display_order   integer DEFAULT 0,
  drive_file_id   text DEFAULT '',
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS strategy_files_strategy_id_idx ON strategy_files(strategy_id);
CREATE INDEX IF NOT EXISTS strategy_files_run_id_idx ON strategy_files(run_id);

ALTER TABLE strategy_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own strategy files"
  ON strategy_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategy files"
  ON strategy_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategy files"
  ON strategy_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategy files"
  ON strategy_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- STRATEGY NOTES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS strategy_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS strategy_notes_strategy_id_idx ON strategy_notes(strategy_id);

ALTER TABLE strategy_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own strategy notes"
  ON strategy_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategy notes"
  ON strategy_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategy notes"
  ON strategy_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategy notes"
  ON strategy_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TAGS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name     text NOT NULL,
  category text DEFAULT 'general',
  color    text DEFAULT '#3a7a46'
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own tags"
  ON tags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON tags FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- STRATEGY TAGS (join)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS strategy_tags (
  strategy_id uuid NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  tag_id      uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (strategy_id, tag_id)
);

ALTER TABLE strategy_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own strategy tags"
  ON strategy_tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_tags.strategy_id
        AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own strategy tags"
  ON strategy_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_tags.strategy_id
        AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own strategy tags"
  ON strategy_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_tags.strategy_id
        AND strategies.user_id = auth.uid()
    )
  );
