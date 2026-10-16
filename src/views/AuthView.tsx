import React, { useState } from 'react';
import { Heart, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = () => {
    onLogin({
      id: 'usr_demo_1',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      avatar: '/src/assets/images/avatar_user_alex_1792172161501.jpg',
      companionAvatar: '/src/assets/images/avatar_companion_sage_1792172159412.jpg',
      preferredTone: 'empathetic',
      consentedMemoryEnabled: true,
      emergencyContact: {
        name: 'Morgan Rivera',
        phone: '+1 (555) 234-5678',
        relationship: 'Sister',
      },
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    onLogin({
      id: `usr_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: '/src/assets/images/avatar_user_alex_1792172161501.jpg',
      companionAvatar: '/src/assets/images/avatar_companion_sage_1792172159412.jpg',
      preferredTone: 'empathetic',
      consentedMemoryEnabled: true,
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-sky-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">MindEase Sanctuary</h1>
          <p className="text-xs text-slate-500">
            {isSignUp ? 'Create your private mental wellness space' : 'Welcome back to your safe sanctuary'}
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-950">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Instant Sanctuary Access
            </span>
            <span className="text-[10px] text-indigo-600 uppercase font-bold tracking-wider">Demo Mode</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Explore with preloaded mood trends, sample journal reflections, and empathetic chat.
          </p>
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full mt-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            Enter with Preloaded Demo Profile <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs text-slate-400 absolute uppercase tracking-wider font-medium">
            or continue with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            {isSignUp ? 'Create Free Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          {isSignUp ? 'Already have a profile?' : "Don't have a profile yet?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local storage encryption · Zero third-party telemetry</span>
        </div>
      </div>
    </div>
  );
};
