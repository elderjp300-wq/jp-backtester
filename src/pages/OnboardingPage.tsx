import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ChevronRight, HardDrive, Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';

type OnboardingStep = 'welcome' | 'login' | 'drive' | 'done';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveFolder, setDriveFolder] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('drive');
  };

  const handleConnectDrive = async () => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 1600));
    setDriveConnected(true);
    setDriveFolder('JP_Backtests_2024');
    setConnecting(false);
  };

  const steps: OnboardingStep[] = ['welcome', 'login', 'drive', 'done'];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center px-5 py-10">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full
          bg-forest-900/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full
          bg-amber-950/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest-800 border border-forest-600/50
            flex items-center justify-center mb-4 glow-green">
            <BarChart2 size={32} className="text-forest-300" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-50 tracking-tight">JP Backtester</h1>
          <p className="text-sm text-charcoal-400 mt-1">Your quant fortress</p>
        </div>

        {/* Step indicator */}
        {step !== 'welcome' && step !== 'done' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['login', 'drive'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${stepIdx > i + 1 ? 'bg-forest-500 text-white' :
                    stepIdx === i + 1 ? 'bg-forest-600 text-white border-2 border-forest-400' :
                    'bg-charcoal-800 text-charcoal-500 border border-charcoal-600'}`}>
                  {stepIdx > i + 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                {i === 0 && <div className={`w-8 h-px ${stepIdx >= 2 ? 'bg-forest-600' : 'bg-charcoal-700'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── WELCOME ── */}
        {step === 'welcome' && (
          <div className="text-center space-y-5">
            <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-6 text-left space-y-4">
              {[
                { icon: '📊', title: 'Organize backtests', sub: 'Import CSVs, PNGs, and JSON results from Google Drive automatically.' },
                { icon: '🔍', title: 'Find your edge', sub: 'Tag, filter, and compare strategies across asset classes and timeframes.' },
                { icon: '📈', title: 'Track performance', sub: 'Sharpe, Sortino, Win Rate, CAGR — all surfaced beautifully.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3 items-start">
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-100">{item.title}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5 leading-relaxed">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('login')}
              className="w-full py-4 bg-forest-500 hover:bg-forest-400 text-white font-semibold
                rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-charcoal-50 mb-1">Sign in</h2>
              <p className="text-sm text-charcoal-400">Access your personal backtest vault.</p>
            </div>

            {/* Google login */}
            <button
              type="button"
              className="w-full py-3.5 flex items-center justify-center gap-3 bg-charcoal-800
                border border-charcoal-600 rounded-2xl text-sm font-medium text-charcoal-100
                hover:bg-charcoal-750 hover:border-charcoal-500 transition-all duration-200 active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-charcoal-700" />
              <span className="text-xs text-charcoal-500">or email</span>
              <div className="flex-1 h-px bg-charcoal-700" />
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-charcoal-800 border border-charcoal-600
                    rounded-2xl text-sm text-charcoal-100 placeholder-charcoal-600
                    focus:outline-none focus:border-forest-600 focus:bg-charcoal-750
                    transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3.5 bg-charcoal-800 border border-charcoal-600
                    rounded-2xl text-sm text-charcoal-100 placeholder-charcoal-600
                    focus:outline-none focus:border-forest-600 focus:bg-charcoal-750
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-forest-500 hover:bg-forest-400 text-white font-semibold
                rounded-2xl transition-all duration-200 active:scale-95"
            >
              Sign In
            </button>
          </form>
        )}

        {/* ── CONNECT DRIVE ── */}
        {step === 'drive' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-charcoal-50 mb-1">Connect Google Drive</h2>
              <p className="text-sm text-charcoal-400">Select the folder where your Colab backtest results live.</p>
            </div>

            <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-charcoal-700
                  flex items-center justify-center">
                  <HardDrive size={22} className={driveConnected ? 'text-forest-400' : 'text-charcoal-400'} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-100">
                    {driveConnected ? 'Connected' : 'Google Drive'}
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {driveConnected ? `📁 ${driveFolder}` : 'Not connected'}
                  </p>
                </div>
                {driveConnected && (
                  <CheckCircle size={20} className="text-forest-400 ml-auto" />
                )}
              </div>

              {!driveConnected && (
                <button
                  onClick={handleConnectDrive}
                  disabled={connecting}
                  className="w-full py-3 bg-charcoal-800 border border-charcoal-600 rounded-xl
                    text-sm font-medium text-charcoal-100 hover:bg-charcoal-750 hover:border-charcoal-500
                    transition-all duration-200 disabled:opacity-60 active:scale-95"
                >
                  {connecting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-charcoal-500 border-t-forest-400
                        rounded-full animate-spin" />
                      Connecting…
                    </span>
                  ) : 'Connect Drive'}
                </button>
              )}

              {driveConnected && (
                <div className="text-xs text-charcoal-500 bg-charcoal-900/50 rounded-xl p-3">
                  JP Backtester will watch this folder and auto-import new backtest files.
                  You can change the folder in Settings anytime.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 bg-charcoal-800 border border-charcoal-600 rounded-2xl
                  text-sm font-medium text-charcoal-300 hover:bg-charcoal-750 transition-all active:scale-95"
              >
                Skip for now
              </button>
              <button
                disabled={!driveConnected}
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 bg-forest-500 hover:bg-forest-400 text-white font-semibold
                  rounded-2xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                  active:scale-95"
              >
                Let's Go
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
