import React, { useState } from 'react';
import {
  MessageCircleHeart,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Wind,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  Compass
} from 'lucide-react';
import { UserProfile, MoodEntry, CompletedActivity } from '../types';
import { NavTab } from '../components/Navbar';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (tab: NavTab) => void;
  recentMoods: MoodEntry[];
  onLogQuickMood: (score: number, label: string) => void;
  activities: CompletedActivity[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  recentMoods,
  onLogQuickMood,
  activities,
}) => {
  const [justLoggedMood, setJustLoggedMood] = useState<string | null>(null);

  // Time-aware greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Latest mood
  const todayMood = recentMoods.length > 0 ? recentMoods[recentMoods.length - 1] : null;

  const moodOptions = [
    { score: 5, label: 'Great', icon: Smile, color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
    { score: 4, label: 'Good', icon: Smile, color: 'text-teal-600', bg: 'hover:bg-teal-50' },
    { score: 3, label: 'Okay', icon: Meh, color: 'text-sky-600', bg: 'hover:bg-sky-50' },
    { score: 2, label: 'Low', icon: Frown, color: 'text-amber-600', bg: 'hover:bg-amber-50' },
    { score: 1, label: 'Distressed', icon: Frown, color: 'text-rose-600', bg: 'hover:bg-rose-50' },
  ];

  const handleMoodClick = (score: number, label: string) => {
    onLogQuickMood(score, label);
    setJustLoggedMood(label);
    setTimeout(() => setJustLoggedMood(null), 3000);
  };

  // Streak calculation
  const streakDays = Math.min(recentMoods.length, 7);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner with Calming Asset */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 text-white min-h-[280px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src="/src/assets/images/hero_calm_wellness_1792171385307.jpg"
          alt="Tranquil morning mist rolling hills"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
            <span>MindEase Sanctuary</span>
            <span aria-hidden="true">·</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-500/80 border-2 border-white/50 flex items-center justify-center font-bold text-white text-base">
                {user.name.charAt(0) || 'U'}
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {timeGreeting}, {user.name}.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
            Take a gentle breath. This is your safe, private sanctuary to unpack thoughts, track your emotional weather, and restore inner equilibrium.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <img
                src={user.companionAvatar || '/src/assets/images/avatar_companion_sage_1792172159412.jpg'}
                alt="AI Companion Sage"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-white/60"
              />
              Talk to MindEase Companion
            </button>
            <button
              onClick={() => onNavigate('meditation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium rounded-xl border border-white/20 transition-colors"
            >
              <Wind className="w-4 h-4 text-sky-300" />
              Quick Breathing Reset
            </button>
          </div>
        </div>
      </div>

      {/* Daily Mood Check-In Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              How are you feeling right now?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Notice without judgment. Naming emotions helps regulate your nervous system.
            </p>
          </div>
          {todayMood && (
            <div className="text-xs text-slate-500">
              Latest check-in: <span className="font-semibold text-slate-800">{todayMood.label}</span>
            </div>
          )}
        </div>

        {justLoggedMood ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Thank you for checking in. Logged your mood as &ldquo;{justLoggedMood}&rdquo;. You can add notes in the Mood tab.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moodOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = todayMood?.label === opt.label;
              return (
                <button
                  key={opt.score}
                  onClick={() => handleMoodClick(opt.score, opt.label)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  } ${opt.bg}`}
                >
                  <Icon className={`w-6 h-6 mb-1.5 ${opt.color}`} />
                  <span className="text-xs font-semibold text-slate-900">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3-Column Wellness Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Guided Companion Topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Conversational Therapy</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Express your feelings freely. MindEase listens without bias, validates your experience, and suggests gentle reframing.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigate('chat')}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition-colors truncate"
              >
                &ldquo;I have been carrying high work stress&rdquo;
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition-colors truncate"
              >
                &ldquo;Help me let go of racing bedtime thoughts&rdquo;
              </button>
            </div>
          </div>
          <button
            onClick={() => onNavigate('chat')}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Start Conversation <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Somatic Breathing & Reset */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Breath & Mindfulness</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Somatic exercises to physically calm your nervous system. Practice Box Breathing (4-4-4-4) or the 5-4-3-2-1 grounding protocol.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-sky-50/50 border border-sky-100/80 text-xs text-slate-700">
              <div className="font-semibold text-sky-950 mb-0.5">Recommended today:</div>
              <div>4-minute Box Breathing to lower cortisol levels.</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('meditation')}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
          >
            Open Breathing Guide <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Reflective Journaling */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Mindful Journaling</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Pour out thoughts in your encrypted private sanctuary. Request gentle AI psychological reflections whenever you seek perspective.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80 text-xs text-slate-700">
              <div className="font-semibold text-emerald-950 mb-0.5">Today&rsquo;s reflection prompt:</div>
              <div className="italic">&ldquo;What is one expectation you can release today?&rdquo;</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('journal')}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            Write Reflection <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snapshot Bar: Consistency & Recent Progress */}
      <div className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Mindful Streak</div>
                <div className="text-base font-bold text-slate-900 tabular-nums">{streakDays} Days</div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Completed Activities</div>
                <div className="text-base font-bold text-slate-900 tabular-nums">{activities.length} total</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <div className="hidden sm:flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Wellness Check-ins</div>
                <div className="text-base font-bold text-slate-900 tabular-nums">{recentMoods.length} logged</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
          >
            View Full Progress & Insights <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtle Clinical Boundary & Privacy Assurance Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-4 px-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Private, encrypted local storage · AI companion for emotional support, not clinical therapy</span>
        </div>
        <button
          onClick={() => onNavigate('assessment')}
          className="hover:text-slate-800 transition-colors"
        >
          Take a Wellness Assessment →
        </button>
      </div>
    </div>
  );
};
