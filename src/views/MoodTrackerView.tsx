import React, { useState } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Plus,
  Calendar,
  Sparkles,
  Trash2,
  TrendingUp,
  Filter,
  Activity,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodTrackerViewProps {
  moods: MoodEntry[];
  onSaveMoods: (moods: MoodEntry[]) => void;
}

export const MoodTrackerView: React.FC<MoodTrackerViewProps> = ({ moods, onSaveMoods }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number>(4);
  const [selectedLabel, setSelectedLabel] = useState<string>('Good');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Calm']);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Personal']);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<MoodEntry | null>(null);

  const moodLevels = [
    { score: 5, label: 'Great', icon: Smile, color: 'text-emerald-600', fill: '#10b981' },
    { score: 4, label: 'Good', icon: Smile, color: 'text-teal-600', fill: '#0d9488' },
    { score: 3, label: 'Okay', icon: Meh, color: 'text-sky-600', fill: '#0284c7' },
    { score: 2, label: 'Low', icon: Frown, color: 'text-amber-600', fill: '#d97706' },
    { score: 1, label: 'Distressed', icon: Frown, color: 'text-rose-600', fill: '#e11d48' },
  ];

  const emotionPool = [
    'Calm',
    'Grateful',
    'Hopeful',
    'Peaceful',
    'Anxious',
    'Overwhelmed',
    'Tired',
    'Irritable',
    'Lonely',
    'Content',
    'Restless',
    'Motivated',
  ];

  const triggerPool = [
    'Work',
    'Sleep',
    'Relationships',
    'Family',
    'Health',
    'Finances',
    'Nature',
    'Deadlines',
    'Solitude',
    'Exercise',
  ];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: new Date().toISOString(),
      moodScore: selectedScore,
      label: selectedLabel,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
      energy: energyLevel,
      notes: notes.trim(),
    };

    onSaveMoods([...moods, newEntry]);
    setShowLogModal(false);
    setNotes('');
  };

  const handleDeleteEntry = (id: string) => {
    onSaveMoods(moods.filter((m) => m.id !== id));
  };

  // Sort chronologically for charts
  const sortedMoods = [...moods].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Compute emotion frequency distribution
  const emotionCounts: Record<string, number> = {};
  moods.forEach((m) => {
    m.emotions.forEach((emo) => {
      emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;
    });
  });
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Average mood calculation
  const averageMood =
    moods.length > 0
      ? (moods.reduce((acc, m) => acc + m.moodScore, 0) / moods.length).toFixed(1)
      : '3.0';

  // SVG Chart Dimensions & Calculations
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = sortedMoods.map((m, idx) => {
    const x =
      sortedMoods.length > 1
        ? paddingX + (idx / (sortedMoods.length - 1)) * (chartWidth - paddingX * 2)
        : chartWidth / 2;
    // Score 1 (bottom) to 5 (top)
    const y = chartHeight - paddingY - ((m.moodScore - 1) / 4) * (chartHeight - paddingY * 2);
    return { x, y, data: m };
  });

  const pathD =
    points.length > 0
      ? points.reduce((acc, pt, idx, arr) => {
          if (idx === 0) return `M ${pt.x} ${pt.y}`;
          // Smooth curve using cubic bezier control points
          const prev = arr[idx - 1];
          const cx1 = prev.x + (pt.x - prev.x) / 2;
          const cy1 = prev.y;
          const cx2 = prev.x + (pt.x - prev.x) / 2;
          const cy2 = pt.y;
          return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
        }, '')
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
          chartHeight - paddingY
        } Z`
      : '';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mood & Emotional Weather</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily feelings, identify stress triggers, and witness your emotional evolution.
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Today&rsquo;s Mood
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Mood Score</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {averageMood} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Grounded and stable trend
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Recorded Check-ins</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {moods.length} <span className="text-xs text-slate-400 font-normal">entries</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Consistent self-awareness</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Dominant Emotional State</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {topEmotions[0]?.[0] || 'Calm'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {topEmotions[0]?.[1] || 0} occurrences logged
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Mood Trend Line Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Emotional Trajectory Over Time</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hover over any point to inspect feelings and triggers on that day.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Great (5)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Okay (3)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Distressed (1)
            </span>
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none">
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[5, 4, 3, 2, 1].map((lvl) => {
              const y = chartHeight - paddingY - ((lvl - 1) / 4) * (chartHeight - paddingY * 2);
              return (
                <g key={lvl}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-medium tabular-nums"
                  >
                    {lvl}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area */}
            {points.length > 0 && <path d={areaD} fill="url(#moodGradient)" />}

            {/* Continuous Spline Line */}
            {points.length > 0 && (
              <path
                d={pathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint(pt.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.id === pt.data.id ? '6' : '4.5'}
                  className={`${
                    pt.data.moodScore >= 4
                      ? 'fill-emerald-500'
                      : pt.data.moodScore === 3
                      ? 'fill-sky-500'
                      : 'fill-amber-500'
                  } stroke-white stroke-2 transition-all`}
                />
              </g>
            ))}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 p-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs max-w-xs animate-fade-in space-y-1">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                <span className="font-bold">{hoveredPoint.label} ({hoveredPoint.moodScore}/5)</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(hoveredPoint.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                <strong>Emotions:</strong> {hoveredPoint.emotions.join(', ') || 'None specified'}
              </div>
              <div className="text-[11px] text-slate-300">
                <strong>Triggers:</strong> {hoveredPoint.triggers.join(', ') || 'None specified'}
              </div>
              {hoveredPoint.notes && (
                <div className="text-[11px] text-slate-400 italic pt-1 truncate">
                  &ldquo;{hoveredPoint.notes}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Emotion Distribution Bar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Most Frequent Emotional States</h3>
          <p className="text-xs text-slate-500 mb-4">Feelings that have surfaced most over your logs</p>

          <div className="space-y-3">
            {topEmotions.map(([emo, count]) => {
              const max = topEmotions[0]?.[1] || 1;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={emo} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{emo}</span>
                    <span className="text-slate-500 tabular-nums">{count} times</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Psychological Insight Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              Pattern Reflection
            </div>
            <h4 className="text-base font-bold text-slate-900">Nurturing Your Steady Foundation</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              When reviewing your recent check-ins, feelings of calm and relief consistently follow periods where you prioritize sleep and time outdoors. Notice how honoring your biological boundaries acts as a buffer against work tension.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 mt-4 flex items-center justify-between">
            <span>Keep tracking daily for deeper wellness patterns</span>
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Past Mood Entries Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Past Mood Records</h3>
        <div className="divide-y divide-slate-100">
          {sortedMoods
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        entry.moodScore >= 4
                          ? 'bg-emerald-50 text-emerald-700'
                          : entry.moodScore === 3
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {entry.label} ({entry.moodScore}/5)
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.date).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 pt-0.5">
                    {entry.emotions.map((emo) => (
                      <span key={emo} className="text-slate-500">
                        #{emo}
                      </span>
                    ))}
                    {entry.triggers.length > 0 && (
                      <span className="text-slate-400">· Triggers: {entry.triggers.join(', ')}</span>
                    )}
                  </div>

                  {entry.notes && (
                    <div className="text-xs text-slate-700 italic pt-0.5">
                      &ldquo;{entry.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Delete entry"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Log Mood Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Check In With Yourself</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Overall Mood Rating
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {moodLevels.map((lvl) => {
                    const Icon = lvl.icon;
                    const isSelected = selectedScore === lvl.score;
                    return (
                      <button
                        key={lvl.score}
                        type="button"
                        onClick={() => {
                          setSelectedScore(lvl.score);
                          setSelectedLabel(lvl.label);
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${lvl.color}`} />
                        <span className="text-[11px] font-semibold text-slate-800">{lvl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emotions checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specific Emotions (Select all that fit)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {emotionPool.map((emo) => {
                    const active = selectedEmotions.includes(emo);
                    return (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => toggleEmotion(emo)}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors border ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Context & Influencing Factors
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {triggerPool.map((trig) => {
                    const active = selectedTriggers.includes(trig);
                    return (
                      <button
                        key={trig}
                        type="button"
                        onClick={() => toggleTrigger(trig)}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors border ${
                          active
                            ? 'bg-purple-600 text-white border-purple-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {trig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Level Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Physical Energy Level</span>
                  <span className="text-indigo-600 tabular-nums">{energyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Reflection Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Reflection or Context (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What is happening around you? What gave you peace or drained you?"
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
