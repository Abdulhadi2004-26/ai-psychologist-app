import { UserProfile, ChatSession, MoodEntry, AssessmentResult, JournalEntry, UserMemoryItem, CompletedActivity } from '../types';

const STORAGE_KEYS = {
  USER: 'mindease_user_profile',
  SESSIONS: 'mindease_chat_sessions',
  MOODS: 'mindease_mood_entries',
  ASSESSMENTS: 'mindease_assessment_results',
  JOURNALS: 'mindease_journal_entries',
  MEMORIES: 'mindease_user_memories',
  ACTIVITIES: 'mindease_completed_activities',
};

// Realistic initial demo seed
const DEFAULT_USER: UserProfile = {
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
  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
};

const DEFAULT_MEMORIES: UserMemoryItem[] = [
  {
    id: 'mem_1',
    content: 'Tends to experience heightened anxiety around high-stakes work presentations on Thursdays.',
    category: 'stressor',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'mem_2',
    content: 'Finds box breathing (4-4-4-4) and walking outside helpful for calming physical restlessness.',
    category: 'preference',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'mem_3',
    content: 'Goal: Practice setting healthier boundaries with after-hours email and avoiding overcommitment.',
    category: 'goal',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const DEFAULT_MOODS: MoodEntry[] = [
  {
    id: 'mood_1',
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    moodScore: 3,
    label: 'Okay',
    emotions: ['Tired', 'Neutral'],
    triggers: ['Work', 'Sleep'],
    energy: 2,
    notes: 'Busy Monday start. Slept poorly but managed through the day.',
  },
  {
    id: 'mood_2',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    moodScore: 2,
    label: 'Low',
    emotions: ['Anxious', 'Overwhelmed'],
    triggers: ['Work', 'Deadlines'],
    energy: 2,
    notes: 'Unexpected project scope increase. Felt tightness in my chest.',
  },
  {
    id: 'mood_3',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    moodScore: 3,
    label: 'Okay',
    emotions: ['Reflective', 'Calm'],
    triggers: ['Personal', 'Walk'],
    energy: 3,
    notes: 'Took a lunch walk and did 5 minutes of box breathing. Re-centered.',
  },
  {
    id: 'mood_4',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    moodScore: 4,
    label: 'Good',
    emotions: ['Relieved', 'Grateful'],
    triggers: ['Relationships', 'Support'],
    energy: 4,
    notes: 'Had a long phone call with my sister Morgan. Felt heard and understood.',
  },
  {
    id: 'mood_5',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    moodScore: 4,
    label: 'Good',
    emotions: ['Productive', 'Calm'],
    triggers: ['Work', 'Sleep'],
    energy: 4,
    notes: 'Completed the major milestone ahead of time! Slept 8 hours.',
  },
  {
    id: 'mood_6',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    moodScore: 5,
    label: 'Great',
    emotions: ['Peaceful', 'Content', 'Grateful'],
    triggers: ['Nature', 'Rest'],
    energy: 5,
    notes: 'Quiet Saturday morning with tea and reading. Felt deeply present.',
  },
  {
    id: 'mood_7',
    date: new Date().toISOString(),
    moodScore: 4,
    label: 'Good',
    emotions: ['Hopeful', 'Calm'],
    triggers: ['Personal growth'],
    energy: 4,
    notes: 'Starting the week with an open mindset and prioritizing mental peace.',
  },
];

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: 'sess_welcome',
    title: 'Managing Work Expectations',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Hi MindEase. I feel like I always say yes to extra tasks at work even when my calendar is full, and then I get totally stressed out.',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: `It takes a lot of self-awareness to notice that pattern. Saying yes often comes from a deep desire to be helpful, reliable, or to avoid letting people down—which is a kind impulse, but when it overrides your own capacity, it takes a heavy toll.

When you notice that impulse to immediately say yes, what is the main fear or thought that pops up if you were to say, "Let me check my bandwidth and get back to you"?`,
        timestamp: new Date(Date.now() - 5 * 86400000 + 4000).toISOString(),
      },
      {
        id: 'msg_3',
        role: 'user',
        content: 'I worry they will think I am not committed or capable enough.',
        timestamp: new Date(Date.now() - 5 * 86400000 + 35000).toISOString(),
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: `That fear makes so much sense—we naturally want our colleagues to see our value. But taking on too much actually puts your energy and the quality of your work at risk. Protecting your limits is an act of professionalism, not weakness.

Would you be open to practicing a gentle "buffer script" this week—a phrase you can keep in your back pocket so you don't feel pressured to commit on the spot?`,
        timestamp: new Date(Date.now() - 5 * 86400000 + 45000).toISOString(),
      },
    ],
  },
];

const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    id: 'jrn_1',
    title: 'Learning to Pause Before Reacting',
    content: 'Today at work I noticed the familiar surge of adrenaline when a critical email arrived. Instead of typing an immediate defensive reply, I stood up, walked to the window, and took five slow breaths. It made a world of difference.',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    moodTag: 'Calm',
    tags: ['Mindfulness', 'Work', 'Growth'],
    aiReflection: 'Pausing in the face of adrenaline is true emotional mastery. You gave yourself the gift of space between stimulus and response.',
  },
  {
    id: 'jrn_2',
    title: 'Sunday Morning Stillness',
    content: 'Sat on the balcony with my tea watching the morning breeze through the leaves. Realized how rarely I let myself just exist without a to-do list in my head. Reminding myself that rest is not a reward to be earned, it is a baseline human need.',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    moodTag: 'Peaceful',
    tags: ['Gratitude', 'Rest', 'Self-Care'],
    aiReflection: 'What a profound truth to anchor in: rest is a baseline human need, not a transaction. May this gentle memory nourish your week.',
  },
];

const DEFAULT_ASSESSMENTS: AssessmentResult[] = [
  {
    id: 'asmt_init_1',
    assessmentId: 'phq_stress_check',
    assessmentTitle: 'Well-Being & Stress Check',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    score: 5,
    maxScore: 12,
    level: 'Mild Stress',
    summary: 'Your responses indicate mild occasional stress and fatigue, primarily linked to daily demands. You show strong personal self-awareness.',
    strengths: 'Good self-monitoring habits and ability to identify when your energy reserves are dipping.',
    recommendedActions: [
      'Maintain consistent wind-down times before sleep.',
      'Practice the 4-7-8 relaxation breath when work feels intense.',
      'Schedule at least 20 minutes of restorative unplugged time daily.',
    ],
  },
];

const DEFAULT_ACTIVITIES: CompletedActivity[] = [
  {
    id: 'act_1',
    type: 'breathing',
    title: 'Box Breathing (4-4-4-4)',
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    durationMinutes: 4,
  },
  {
    id: 'act_2',
    type: 'journal',
    title: 'Learning to Pause Before Reacting',
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    durationMinutes: 6,
  },
  {
    id: 'act_3',
    type: 'breathing',
    title: '4-7-8 Relaxing Breath',
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    durationMinutes: 5,
  },
  {
    id: 'act_4',
    type: 'grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    durationMinutes: 5,
  },
];

export const storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveUser(DEFAULT_USER);
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // storage unavailable
    }
  },

  getSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveSessions(DEFAULT_SESSIONS);
    return DEFAULT_SESSIONS;
  },

  saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  },

  getMoods(): MoodEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveMoods(DEFAULT_MOODS);
    return DEFAULT_MOODS;
  },

  saveMoods(moods: MoodEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
    } catch {
      // ignore
    }
  },

  getAssessments(): AssessmentResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveAssessments(DEFAULT_ASSESSMENTS);
    return DEFAULT_ASSESSMENTS;
  },

  saveAssessments(assessments: AssessmentResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } catch {
      // ignore
    }
  },

  getJournals(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveJournals(DEFAULT_JOURNALS);
    return DEFAULT_JOURNALS;
  },

  saveJournals(journals: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    } catch {
      // ignore
    }
  },

  getMemories(): UserMemoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveMemories(DEFAULT_MEMORIES);
    return DEFAULT_MEMORIES;
  },

  saveMemories(memories: UserMemoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch {
      // ignore
    }
  },

  getActivities(): CompletedActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveActivities(DEFAULT_ACTIVITIES);
    return DEFAULT_ACTIVITIES;
  },

  saveActivities(activities: CompletedActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  },

  // Full data export for privacy compliance
  exportAllData(): string {
    const backup = {
      exportDate: new Date().toISOString(),
      user: this.getUser(),
      sessions: this.getSessions(),
      moods: this.getMoods(),
      assessments: this.getAssessments(),
      journals: this.getJournals(),
      memories: this.getMemories(),
      activities: this.getActivities(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Permanent Wipe Data for privacy right-to-erasure
  wipeAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};
