import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Plus, TrendingUp, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home,       label: 'Home',     path: '/dashboard' },
  { icon: Grid3X3,    label: 'Library',  path: '/library' },
  { icon: TrendingUp, label: 'Edges',    path: '/edges' },
  { icon: Settings,   label: 'Settings', path: '/settings' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass border-t border-charcoal-700/60 px-2 pb-1 pt-1">
        <div className="flex items-center justify-around max-w-lg mx-auto relative">

          {/* Scan Drive FAB — center */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7">
            <button
              onClick={() => navigate('/library')}
              className="w-14 h-14 rounded-full bg-forest-500 hover:bg-forest-400
                flex items-center justify-center shadow-xl glow-green
                border-4 border-charcoal-900 interactive active:scale-95"
            >
              <Plus size={24} className="text-white" strokeWidth={2.5} />
            </button>
          </div>

          {NAV_ITEMS.map(({ icon: Icon, label, path }, i) => {
            const active = pathname === path || pathname.startsWith(path + '/');
            return (
              <React.Fragment key={path}>
                <button
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl interactive
                    ${active
                      ? 'text-forest-300'
                      : 'text-charcoal-400 hover:text-charcoal-200'
                    }`}
                >
                  <div className="relative">
                    <Icon size={22} strokeWidth={active ? 2 : 1.75} />
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1
                        rounded-full bg-forest-400" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? '' : ''}`}>{label}</span>
                </button>
                {/* Spacer for FAB */}
                {i === 1 && <div className="w-14" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
