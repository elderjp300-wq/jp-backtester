import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardDrive, Bell, Shield, Moon, ChevronRight,
  RefreshCw, Folder, LogOut, BarChart2,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

function SettingRow({ label, sub, icon: Icon, action, color = '' }: {
  label: string;
  sub?: string;
  icon: React.ElementType;
  action?: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-charcoal-800/60 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700
        flex items-center justify-center flex-none">
        <Icon size={16} className={color || 'text-charcoal-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal-100">{label}</p>
        {sub && <p className="text-xs text-charcoal-500 mt-0.5">{sub}</p>}
      </div>
      {action ?? <ChevronRight size={16} className="text-charcoal-600 flex-none" />}
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoal-950 pb-28">
      <header className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-forest-800 border border-forest-600/50
            flex items-center justify-center">
            <BarChart2 size={22} className="text-forest-300" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal-50">Settings</h1>
            <p className="text-xs text-charcoal-500">JP Backtester v0.1.0</p>
          </div>
        </div>

        {/* User card */}
        <div className="flex items-center gap-4 p-4 bg-charcoal-850 border border-charcoal-700 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-forest-800 border border-forest-700
            flex items-center justify-center text-forest-300 font-bold text-lg">
            JP
          </div>
          <div>
            <p className="font-semibold text-charcoal-100 text-sm">JP</p>
            <p className="text-xs text-charcoal-500">jp@quantfortress.io</p>
          </div>
          <button className="ml-auto text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">
            Edit
          </button>
        </div>
      </header>

      <div className="px-5 space-y-4">

        {/* Google Drive */}
        <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-4">
            Google Drive
          </h2>
          <SettingRow
            icon={HardDrive}
            label="Connected Account"
            sub="jp@gmail.com"
            color="text-forest-400"
            action={
              <span className="flex items-center gap-1.5 text-xs text-forest-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse-soft" />
                Live
              </span>
            }
          />
          <SettingRow
            icon={Folder}
            label="Backtest Folder"
            sub="JP_Backtests_2024"
            color="text-charcoal-400"
          />
          <SettingRow
            icon={RefreshCw}
            label="Auto-Sync"
            sub="Scan every 30 minutes"
            color="text-charcoal-400"
            action={
              <button className="relative w-10 h-6 bg-forest-600 rounded-full border border-forest-500
                transition-all flex items-center">
                <span className="w-4 h-4 rounded-full bg-white shadow translate-x-4 transition-transform" />
              </button>
            }
          />
        </div>

        {/* App preferences */}
        <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-4">
            Preferences
          </h2>
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            sub="Always on"
            color="text-charcoal-400"
            action={
              <button className="relative w-10 h-6 bg-forest-600 rounded-full border border-forest-500
                transition-all flex items-center">
                <span className="w-4 h-4 rounded-full bg-white shadow translate-x-4 transition-transform" />
              </button>
            }
          />
          <SettingRow
            icon={Bell}
            label="Notifications"
            sub="Import complete alerts"
            color="text-charcoal-400"
          />
        </div>

        {/* Security */}
        <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-4">
            Security
          </h2>
          <SettingRow
            icon={Shield}
            label="App Lock"
            sub="Biometric / PIN"
            color="text-amber-400"
          />
        </div>

        {/* Sign out */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 py-4
            bg-charcoal-850 border border-charcoal-700 rounded-2xl text-sm
            text-red-400 hover:bg-red-950/20 hover:border-red-900/50 transition-all active:scale-95"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <p className="text-center text-xs text-charcoal-700 pb-2">
          Built with care · JP Backtester © 2024
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
