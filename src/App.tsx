import React, { useState, useEffect } from 'react';
import { UserProfile, ChatSession, MoodEntry, AssessmentResult, JournalEntry, UserMemoryItem, CompletedActivity } from './types';
import { storage } from './services/storage';
import { Navbar, NavTab } from './components/Navbar';
import { CrisisModal } from './components/CrisisModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { MoodTrackerView } from './views/MoodTrackerView';
import { AssessmentView } from './views/AssessmentView';
import { JournalView } from './views/JournalView';
import { MeditationView } from './views/MeditationView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [sessions, setSessions] = useState<ChatSession[]>(() => storage.getSessions());
  const [moods, setMoods] = useState<MoodEntry[]>(() => storage.getMoods());
  const [journals, setJournals] = useState<JournalEntry[]>(() => storage.getJournals());
  const [assessments, setAssessments] = useState<AssessmentResult[]>(() => storage.getAssessments());
  const [memories, setMemories] = useState<UserMemoryItem[]>(() => storage.getMemories());
  const [activities, setActivities] = useState<CompletedActivity[]>(() => storage.getActivities());

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!user.hasCompletedOnboarding);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Sync state changes with local storage
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    storage.saveUser(newUser);
  };

  const handleSaveSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    storage.saveSessions(newSessions);
  };

  const handleSaveMoods = (newMoods: MoodEntry[]) => {
    setMoods(newMoods);
    storage.saveMoods(newMoods);
  };

  const handleSaveJournals = (newJournals: JournalEntry[]) => {
    setJournals(newJournals);
    storage.saveJournals(newJournals);
  };

  const handleSaveAssessments = (newAssessments: AssessmentResult[]) => {
    setAssessments(newAssessments);
    storage.saveAssessments(newAssessments);
  };

  const handleSaveMemories = (newMemories: UserMemoryItem[]) => {
    setMemories(newMemories);
    storage.saveMemories(newMemories);
  };

  const handleLogActivity = (activity: CompletedActivity) => {
    const newActs = [...activities, activity];
    setActivities(newActs);
    storage.saveActivities(newActs);
  };

  const handleLogQuickMood = (score: number, label: string) => {
    const entry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: new Date().toISOString(),
      moodScore: score,
      label,
      emotions: [label],
      triggers: ['Daily Check-in'],
      energy: score,
      notes: 'Quick daily dashboard check-in',
    };
    handleSaveMoods([...moods, entry]);
  };

  const handleWipeAllData = () => {
    storage.wipeAllData();
    const freshUser = storage.getUser();
    setUser(freshUser);
    setSessions(storage.getSessions());
    setMoods(storage.getMoods());
    setJournals(storage.getJournals());
    setAssessments(storage.getAssessments());
    setMemories(storage.getMemories());
    setActivities(storage.getActivities());
    setCurrentTab('dashboard');
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    storage.saveUser(newUser);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        user={user}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            onNavigate={setCurrentTab}
            recentMoods={moods}
            onLogQuickMood={handleLogQuickMood}
            activities={activities}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            user={user}
            sessions={sessions}
            onSaveSessions={handleSaveSessions}
            memories={memories}
            onSaveMemories={handleSaveMemories}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentTab === 'mood' && (
          <MoodTrackerView
            moods={moods}
            onSaveMoods={handleSaveMoods}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            pastResults={assessments}
            onSaveResult={(res) => handleSaveAssessments([res, ...assessments])}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentTab === 'journal' && (
          <JournalView
            journals={journals}
            onSaveJournals={handleSaveJournals}
          />
        )}

        {currentTab === 'meditation' && (
          <MeditationView
            onLogActivity={handleLogActivity}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            moods={moods}
            activities={activities}
            journals={journals}
            assessments={assessments}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            memories={memories}
            onSaveMemories={handleSaveMemories}
            onWipeAllData={handleWipeAllData}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Crisis & Emergency Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
        user={user}
      />

      {/* Informed Consent & Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(updated) => {
          handleUpdateUser(updated);
          setIsOnboardingOpen(false);
        }}
        user={user}
      />
    </div>
  );
}
