import React, { useState } from 'react';
import {
  User,
  Shield,
  Brain,
  Download,
  Trash2,
  Phone,
  Check,
  AlertTriangle,
  Lock,
  HeartHandshake,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserProfile, UserMemoryItem } from '../types';
import { storage } from '../services/storage';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  memories: UserMemoryItem[];
  onSaveMemories: (memories: UserMemoryItem[]) => void;
  onWipeAllData: () => void;
  onOpenCrisis: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  memories,
  onSaveMemories,
  onWipeAllData,
  onOpenCrisis,
}) => {
  const [name, setName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.avatar || '/src/assets/images/avatar_user_alex_1792172161501.jpg'
  );
  const [preferredTone, setPreferredTone] = useState<UserProfile['preferredTone']>(user.preferredTone);
  const [consentedMemory, setConsentedMemory] = useState(user.consentedMemoryEnabled);
  const [contactName, setContactName] = useState(user.emergencyContact?.name || '');
  const [contactPhone, setContactPhone] = useState(user.emergencyContact?.phone || '');
  const [contactRel, setContactRel] = useState(user.emergencyContact?.relationship || '');
  const [savedStatus, setSavedStatus] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);

  const availableAvatars = [
    {
      id: 'alex',
      title: 'Mindful Portrait',
      path: '/src/assets/images/avatar_user_alex_1792172161501.jpg',
    },
    {
      id: 'lotus',
      title: 'Zen Lotus',
      path: '/src/assets/images/avatar_user_lotus_1792172161361.jpg',
    },
    {
      id: 'sun',
      title: 'Sunrise Harmony',
      path: '/src/assets/images/avatar_user_sun_1792172161888.jpg',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim() || 'Friend',
      avatar: selectedAvatar,
      preferredTone,
      consentedMemoryEnabled: consentedMemory,
      emergencyContact: {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRel.trim(),
      },
    });

    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleExportData = () => {
    const jsonStr = storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindease-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteMemoryItem = (id: string) => {
    onSaveMemories(memories.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile, Privacy & Memory</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Control your AI companion&rsquo;s tone, manage remembered personal context, and maintain complete ownership of your data.
        </p>
      </div>

      {savedStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings successfully updated.
        </div>
      )}

      {/* Profile & Tone Preferences */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-indigo-600" />
          Personal Companion Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name or Alias</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Local Reference Only)</label>
            <input
              type="email"
              disabled
              value={user.email || 'local-guest@mindease.app'}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
            />
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Choose Your Sanctuary Profile Avatar
          </label>
          <div className="grid grid-cols-3 gap-3">
            {availableAvatars.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedAvatar(av.path)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  selectedAvatar === av.path
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <img
                  src={av.path}
                  alt={av.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <span className="text-xs font-semibold text-slate-800 text-center">
                  {av.title}
                </span>
                {selectedAvatar === av.path && (
                  <span className="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-indigo-600" /> Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Companion Voice & Psychological Approach
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { id: 'empathetic', title: 'Empathetic & Nurturing', desc: 'Focuses on deep emotional validation, warmth, and safe unconditional holding' },
                { id: 'practical', title: 'Grounded & Practical', desc: 'Emphasizes tangible somatic coping exercises, CBT reframing, and action steps' },
                { id: 'inquisitive', title: 'Reflective & Inquisitive', desc: 'Gently asks deep open-ended questions to facilitate self-discovery' },
                { id: 'gentle', title: 'Gentle & Minimalist', desc: 'Short, calm responses for times when words feel overwhelming' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPreferredTone(t.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredTone === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                  {t.title}
                  {preferredTone === t.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-normal">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contact Designation */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              Trusted Personal Emergency Contact
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A friend, family member, or trusted person to display during crisis assistance screens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Morgan Rivera"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +1 555-234-5678"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship</label>
              <input
                type="text"
                value={contactRel}
                onChange={(e) => setContactRel(e.target.value)}
                placeholder="e.g. Sister, Best Friend"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Save Profile & Preferences
          </button>
        </div>
      </form>

      {/* AI Memory Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              Consented AI Memory Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, edit, or delete items that your AI companion remembers about your goals and patterns.
            </p>
          </div>

          {/* Toggle Master Memory */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Enable Memory:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consentedMemory}
                onChange={(e) => {
                  setConsentedMemory(e.target.checked);
                  onUpdateUser({ consentedMemoryEnabled: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* List of Memories */}
        <div className="space-y-2.5">
          {memories.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No memories are currently stored.
            </div>
          ) : (
            memories.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 text-xs group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    {m.category}
                  </span>
                  <p className="text-slate-800">{m.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteMemoryItem(m.id)}
                  title="Remove this memory"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Data Ownership, Export & Right-to-Erasure */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="w-4 h-4 text-emerald-600" />
          Privacy, Security & Data Rights
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          MindEase values the sanctity and vulnerability of mental wellness conversations. Your reflections and history are stored within your browser&rsquo;s isolated local sandbox. You hold complete ownership and can export or erase everything at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                Export Complete Data Backup
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Download a clean JSON archive containing your chat sessions, mood logs, journal reflections, and assessment scores.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Data (JSON)
            </button>
          </div>

          {/* Wipe All Data */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Permanent Right to Erasure
              </div>
              <p className="text-[11px] text-rose-700/80 mt-1">
                Permanently purge all conversations, memories, moods, and profiles from this device. This action cannot be reversed.
              </p>
            </div>

            {confirmWipe ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onWipeAllData();
                    setConfirmWipe(false);
                  }}
                  className="flex-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setConfirmWipe(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmWipe(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
              >
                Permanently Wipe All Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
