import React from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Wind,
  BookOpen,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { MoodEntry, CompletedActivity, JournalEntry, AssessmentResult } from '../types';

interface ProgressViewProps {
  moods: MoodEntry[];
  activities: CompletedActivity[];
  journals: JournalEntry[];
  assessments: AssessmentResult[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  moods,
  activities,
  journals,
  assessments,
}) => {
  // Compute total mindful minutes
  const totalMindfulMinutes = activities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);

  // Consistency streak
  const streakDays = Math.min(moods.length, 7);

  // Group activities by type
  const breathingCount = activities.filter((a) => a.type === 'breathing').length;
  const groundingCount = activities.filter((a) => a.type === 'grounding').length;
  const journalCount = journals.length;
  const assessmentCount = assessments.length;

  // Average mood
  const avgMood =
    moods.length > 0
      ? (moods.reduce((acc, m) => acc + m.moodScore, 0) / moods.length).toFixed(1)
      : '3.0';

  const milestones = [
    {
      title: 'First Reflection',
      desc: 'Took the brave first step to log feelings honestly.',
      unlocked: moods.length > 0,
      icon: Heart,
    },
    {
      title: 'Mindful Breather',
      desc: 'Completed at least 3 breathing or grounding resets.',
      unlocked: breathingCount + groundingCount >= 3,
      icon: Wind,
    },
    {
      title: 'Dedicated Journaler',
      desc: 'Saved thoughtful journal reflections.',
      unlocked: journalCount >= 2,
      icon: BookOpen,
    },
    {
      title: 'Consistency Guardian',
      desc: 'Built a multi-day streak of intentional emotional check-ins.',
      unlocked: streakDays >= 3,
      icon: Award,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wellness Progress & Personal Insights</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your emotional trajectory, completed practices, and gentle milestones achieved.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Active Streak</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{streakDays} Days</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Consistent daily presence</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Mindful Minutes</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalMindfulMinutes} <span className="text-xs text-slate-400 font-normal">mins</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Somatic nervous system care</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Average Mood</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {avgMood} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">Over {moods.length} total entries</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Completed Exercises</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {activities.length} <span className="text-xs text-slate-400 font-normal">sessions</span>
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Breathing & grounding</div>
        </div>
      </div>

      {/* Activity Breakdown Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Wellness Activities Breakdown</h3>
          <p className="text-xs text-slate-500 mb-5">Where you have directed your self-care time</p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-600" /> Somatic Breathing
                </span>
                <span className="text-slate-500 tabular-nums">{breathingCount} sessions</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${Math.min(100, breathingCount * 25)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Reflective Journaling
                </span>
                <span className="text-slate-500 tabular-nums">{journalCount} reflections</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, journalCount * 33)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" /> Sensory Grounding (5-4-3-2-1)
                </span>
                <span className="text-slate-500 tabular-nums">{groundingCount} sessions</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, groundingCount * 30)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Wellness Assessments
                </span>
                <span className="text-slate-500 tabular-nums">{assessmentCount} completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.min(100, assessmentCount * 50)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Mindfulness Milestones</h3>
          <p className="text-xs text-slate-500 mb-5">Celebrate small, meaningful steps toward self-compassion</p>

          <div className="grid grid-cols-2 gap-3">
            {milestones.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    m.unlocked
                      ? 'border-indigo-200 bg-indigo-50/50 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${m.unlocked ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {m.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold">{m.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Completed Activities History</h3>
        <div className="divide-y divide-slate-100">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No completed activities recorded yet. Try a 5-minute breathing exercise in the Breathing tab!
            </div>
          ) : (
            activities
              .slice()
              .reverse()
              .map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      {act.type === 'breathing' ? (
                        <Wind className="w-3.5 h-3.5" />
                      ) : act.type === 'grounding' ? (
                        <Activity className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{act.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(act.completedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-500 font-medium tabular-nums">
                    {act.durationMinutes} min{act.durationMinutes === 1 ? '' : 's'}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
