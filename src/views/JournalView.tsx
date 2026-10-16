import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Sparkles,
  Trash2,
  Search,
  Calendar,
  Heart,
  Quote,
  Feather,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { JournalEntry } from '../types';

interface JournalViewProps {
  journals: JournalEntry[];
  onSaveJournals: (journals: JournalEntry[]) => void;
}

const INSPIRATIONAL_PROMPTS = [
  'What is one boundary or expectation you gave yourself permission to soften today?',
  'What did your body or mind try to tell you today that you might have ignored?',
  'Write down 3 small moments from this week that brought an unexpected sense of ease.',
  'If a dear friend were feeling exactly the way you feel right now, what gentle words would you offer them?',
  'What is a thought you keep returning to, and what might it need from you to be put down for the night?',
];

export const JournalView: React.FC<JournalViewProps> = ({ journals, onSaveJournals }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('Calm');
  const [tagsInput, setTagsInput] = useState('Mindfulness, Growth');
  const [isReflecting, setIsReflecting] = useState(false);
  const [activeEntryForReflection, setActiveEntryForReflection] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);

  const moodTagOptions = ['Calm', 'Peaceful', 'Grateful', 'Reflective', 'Vulnerable', 'Heavy', 'Hopeful'];

  const cyclePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % INSPIRATIONAL_PROMPTS.length);
  };

  const useCurrentPrompt = () => {
    setTitle(INSPIRATIONAL_PROMPTS[promptIndex]);
    setIsWriting(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newEntry: JournalEntry = {
      id: `jrn_${Date.now()}`,
      title: title.trim() || 'Untitled Reflection',
      content: content.trim(),
      date: new Date().toISOString(),
      moodTag,
      tags,
    };

    onSaveJournals([newEntry, ...journals]);
    setIsWriting(false);
    setTitle('');
    setContent('');
  };

  const handleDeleteEntry = (id: string) => {
    onSaveJournals(journals.filter((j) => j.id !== id));
    if (activeEntryForReflection?.id === id) {
      setActiveEntryForReflection(null);
    }
  };

  const handleRequestAiReflection = async (entry: JournalEntry) => {
    setIsReflecting(true);
    setActiveEntryForReflection(entry);

    try {
      const res = await fetch('/api/journal/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          mood: entry.moodTag,
        }),
      });

      const data = await res.json();
      const updatedReflection = data.reflection || 'Thank you for giving voice to your inner thoughts.';

      const updated = journals.map((j) =>
        j.id === entry.id ? { ...j, aiReflection: updatedReflection } : j
      );
      onSaveJournals(updated);
      setActiveEntryForReflection({ ...entry, aiReflection: updatedReflection });
    } catch (err) {
      console.error('Failed to get journal reflection:', err);
    } finally {
      setIsReflecting(false);
    }
  };

  const filteredJournals = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header with Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/journal_mindful_1792171386735.jpg"
          alt="Mindful open journal with chamomile tea"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/50 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-xl space-y-1">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5" /> Mindful Sanctuary
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Private Journal & Reflections</h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Unpack thoughts without filter. Your words are strictly saved on your device.
            </p>
          </div>

          <button
            onClick={() => setIsWriting(!isWriting)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            {isWriting ? 'Cancel Entry' : 'Write New Reflection'}
          </button>
        </div>
      </div>

      {/* Inspirational Daily Prompt Card */}
      {!isWriting && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Writing Prompt of the Day
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 mt-0.5 italic">
                &ldquo;{INSPIRATIONAL_PROMPTS[promptIndex]}&rdquo;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={cyclePrompt}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Another Prompt
            </button>
            <button
              onClick={useCurrentPrompt}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg transition-colors"
            >
              Use This Prompt
            </button>
          </div>
        </div>
      )}

      {/* Write New Entry Form */}
      {isWriting && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 sm:p-7 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              New Journal Reflection
            </h2>
            <button
              onClick={() => setIsWriting(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your reflection a title (or leave blank for Untitled)"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emotional Mood Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {moodTagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setMoodTag(tag)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        moodTag === tag
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Work, Gratitude, Boundaries"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Thoughts & Reflections
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely. Don't worry about spelling, grammar, or making sense. Just let what is inside surface..."
                rows={7}
                required
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by keyword or tag..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-500">{filteredJournals.length} reflections stored</span>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No reflections found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your journal is clean and ready. Click &ldquo;Write New Reflection&rdquo; to begin documenting your inner dialogue.
            </p>
          </div>
        ) : (
          filteredJournals.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700">{entry.moodTag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(entry.date).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{entry.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRequestAiReflection(entry)}
                    disabled={isReflecting && activeEntryForReflection?.id === entry.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isReflecting && activeEntryForReflection?.id === entry.id
                      ? 'Reflecting...'
                      : entry.aiReflection
                      ? 'Re-Reflect'
                      : 'Empathetic Reflection'}
                  </button>

                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Delete reflection"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Journal Text */}
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entry.tags.map((t) => (
                    <span key={t} className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Psychological Feedback Reflection */}
              {entry.aiReflection && (
                <div className="mt-3 p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-purple-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    Companion Reflection
                  </div>
                  <p className="leading-relaxed text-slate-700">{entry.aiReflection}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
