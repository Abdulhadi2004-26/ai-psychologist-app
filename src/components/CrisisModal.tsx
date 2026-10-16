import React, { useState } from 'react';
import { Phone, AlertCircle, HeartHandshake, Shield, ExternalLink, X, MapPin } from 'lucide-react';
import { UserProfile } from '../types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose, user }) => {
  const [selectedRegion, setSelectedRegion] = useState<'us' | 'uk' | 'ca' | 'au' | 'intl'>('us');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        {/* Header Banner */}
        <div className="bg-rose-50 px-6 py-5 border-b border-rose-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Immediate Support & Crisis Resources</h2>
              <p className="text-xs text-rose-700 mt-0.5 font-medium">
                Free, confidential, 24/7 human support · You do not have to carry this alone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
            aria-label="Close crisis support modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Compassionate Message */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              You are valued, and help is available right now.
            </p>
            MindEase is an AI wellness companion, not a substitute for crisis intervention or licensed medical care. If you or someone you know is in immediate danger or experiencing severe emotional distress, please reach out to one of the trusted services below.
          </div>

          {/* Region Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Select Your Location
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(
                [
                  { id: 'us', label: 'United States' },
                  { id: 'ca', label: 'Canada' },
                  { id: 'uk', label: 'United Kingdom' },
                  { id: 'au', label: 'Australia' },
                  { id: 'intl', label: 'International' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRegion(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedRegion === tab.id
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Hotline Numbers */}
          <div className="space-y-3">
            {selectedRegion === 'us' && (
              <>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">988 Suicide & Crisis Lifeline</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call or text 988 · Free, confidential 24/7 support across the US</div>
                  </div>
                  <a
                    href="tel:988"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call or Text 988
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Crisis Text Line</div>
                    <div className="text-xs text-slate-600 mt-0.5">Text HOME to 741741 to connect with a crisis counselor 24/7</div>
                  </div>
                  <a
                    href="sms:741741?body=HOME"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Text HOME to 741741
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">The Trevor Project (LGBTQ+ Youth)</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 1-866-488-7386 or text START to 678-678</div>
                  </div>
                  <a
                    href="tel:18664887386"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Call 1-866-488-7386
                  </a>
                </div>
              </>
            )}

            {selectedRegion === 'ca' && (
              <>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">988 Suicide Crisis Helpline (Canada)</div>
                    <div className="text-xs text-slate-600 mt-0.5">Toll-free 24/7 suicide prevention service in English and French</div>
                  </div>
                  <a
                    href="tel:988"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call or Text 988
                  </a>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Kids Help Phone</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 1-800-668-6868 or text CONNECT to 686868</div>
                  </div>
                  <a
                    href="tel:18006686868"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Call 1-800-668-6868
                  </a>
                </div>
              </>
            )}

            {selectedRegion === 'uk' && (
              <>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Samaritans UK</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 116 123 (free from any phone) · Available 24 hours a day, 365 days a year</div>
                  </div>
                  <a
                    href="tel:116123"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call 116 123
                  </a>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">NHS 111 Mental Health</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 111 for urgent NHS mental health support</div>
                  </div>
                  <a
                    href="tel:111"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Call 111
                  </a>
                </div>
              </>
            )}

            {selectedRegion === 'au' && (
              <>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Lifeline Australia</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 13 11 14 · 24/7 crisis support and suicide prevention</div>
                  </div>
                  <a
                    href="tel:131114"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call 13 11 14
                  </a>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Beyond Blue</div>
                    <div className="text-xs text-slate-600 mt-0.5">Call 1300 22 4636 · Mental health and anxiety support</div>
                  </div>
                  <a
                    href="tel:1300224636"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Call 1300 22 4636
                  </a>
                </div>
              </>
            )}

            {selectedRegion === 'intl' && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="text-sm font-bold text-slate-900">Worldwide Crisis Centers Directory</div>
                <p className="text-xs text-slate-600">
                  Find verified local crisis hotlines in over 100 countries through volunteer directories:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href="https://www.befrienders.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Befrienders Worldwide
                  </a>
                  <a
                    href="https://findahelpline.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Find A Helpline
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User's Designated Personal Emergency Contact */}
          {user.emergencyContact?.name && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                    Your Designated Personal Contact
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {user.emergencyContact.name}{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      ({user.emergencyContact.relationship || 'Support Person'})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{user.emergencyContact.phone}</div>
                </div>
                {user.emergencyContact.phone && (
                  <a
                    href={`tel:${user.emergencyContact.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {user.emergencyContact.name.split(' ')[0]}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Immediate Grounding Tip */}
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Quick grounding technique:</strong> Plant your feet firmly on the floor. Take 3 deep, steady breaths. Look around and name 5 blue or green objects you can see. You are safe in this physical moment.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>In extreme physical emergencies, dial your local emergency service (911 / 999 / 112).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
