import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updated: Partial<UserProfile>) => void;
  user: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, user }) => {
  const [name, setName] = useState(user.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.avatar || '/src/assets/images/avatar_user_alex_1792172161501.jpg'
  );
  const [preferredTone, setPreferredTone] = useState<UserProfile['preferredTone']>(user.preferredTone || 'empathetic');
  const [consentedMemory, setConsentedMemory] = useState(user.consentedMemoryEnabled ?? true);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!acceptedDisclaimer) return;
    onComplete({
      name: name.trim() || 'Friend',
      avatar: selectedAvatar,
      preferredTone,
      consentedMemoryEnabled: consentedMemory,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 px-6 py-6 border-b border-indigo-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Welcome to MindEase</h2>
              <p className="text-xs text-slate-600 mt-0.5">Your empathetic, private AI mental wellness companion</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-5">
              {/* Important clinical boundary declaration */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Clinical & Safety Boundaries
                </div>
                <p>
                  MindEase is an AI-powered conversational companion built to offer compassionate emotional validation, stress coping strategies, and wellness self-reflection.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-amber-800">
                  <li>MindEase does <strong>not</strong> provide medical or psychiatric diagnoses.</li>
                  <li>It does <strong>not</strong> prescribe, manage, or advise changing medications.</li>
                  <li>It does <strong>not</strong> replace human clinical psychotherapy or acute crisis intervention.</li>
                </ul>
              </div>

              {/* Acceptance checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={acceptedDisclaimer}
                  onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 leading-normal">
                  I understand that MindEase is an AI emotional wellness companion and not a licensed healthcare provider, and I agree to use it for supportive self-reflection.
                </span>
              </label>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!acceptedDisclaimer}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How should MindEase address you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your preferred name or nickname"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select your profile avatar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'alex', title: 'Portrait', path: '/src/assets/images/avatar_user_alex_1792172161501.jpg' },
                    { id: 'lotus', title: 'Lotus', path: '/src/assets/images/avatar_user_lotus_1792172161361.jpg' },
                    { id: 'sun', title: 'Sunrise', path: '/src/assets/images/avatar_user_sun_1792172161888.jpg' },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.path)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedAvatar === av.path
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={av.path}
                        alt={av.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">{av.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose your companion's preferred tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'empathetic', title: 'Empathetic & Nurturing', desc: 'Warm, deep validation & gentle care' },
                      { id: 'practical', title: 'Grounded & Practical', desc: 'Actionable coping tools & steps' },
                      { id: 'inquisitive', title: 'Reflective & Inquisitive', desc: 'Thoughtful self-discovery questions' },
                      { id: 'gentle', title: 'Gentle & Minimalist', desc: 'Quiet, soft space with short answers' },
                    ] as const
                  ).map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setPreferredTone(tone.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        preferredTone === tone.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                        {tone.title}
                        {preferredTone === tone.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Memory Explicit Consent */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-slate-900">AI Context & Memory</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentedMemory}
                      onChange={(e) => setConsentedMemory(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  With your consent, MindEase remembers goals you discuss (e.g., managing work anxiety) to personalize future conversations. You can view, edit, or wipe these memories anytime in Settings.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Enter Sanctuary <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
