import React, { useState } from 'react';
import { Heart, LifeBuoy, Menu, X, User } from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'dashboard' | 'chat' | 'mood' | 'assessment' | 'journal' | 'meditation' | 'progress' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCrisis: () => void;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenCrisis, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'chat', label: 'AI Therapy' },
    { id: 'mood', label: 'Mood' },
    { id: 'assessment', label: 'Assessments' },
    { id: 'journal', label: 'Journal' },
    { id: 'meditation', label: 'Breathing' },
    { id: 'progress', label: 'Insights' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 fill-current" />
          </span>
          <span>MindEase</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                currentTab === item.id ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {item.label}
              {currentTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action & Emergency button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCrisis}
            title="Immediate Crisis & Emergency Support"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Crisis</span> Support
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            title="Profile & Privacy Settings"
            className={`p-0.5 rounded-full border transition-all overflow-hidden w-8 h-8 flex items-center justify-center ${
              currentTab === 'settings'
                ? 'border-indigo-600 ring-2 ring-indigo-300'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentTab === item.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>Signed in as {user.name}</span>
            <button
              onClick={() => {
                onSelectTab('settings');
                setMobileMenuOpen(false);
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
