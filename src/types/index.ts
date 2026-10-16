export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companionAvatar?: string;
  preferredTone: 'empathetic' | 'practical' | 'inquisitive' | 'gentle';
  consentedMemoryEnabled: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  demoMode?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface MoodEntry {
  id: string;
  date: string; // ISO string
  moodScore: number; // 1 (Very Low) to 5 (Great)
  label: string; // 'Great' | 'Good' | 'Okay' | 'Low' | 'Distressed'
  emotions: string[];
  triggers: string[];
  energy: number; // 1 to 5
  notes: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: { label: string; score: number }[];
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  category: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  date: string;
  score: number;
  maxScore: number;
  level: string;
  summary: string;
  strengths: string;
  recommendedActions: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  moodTag: string;
  tags: string[];
  aiReflection?: string;
}

export interface UserMemoryItem {
  id: string;
  content: string;
  category: 'goal' | 'preference' | 'stressor' | 'strength';
  createdAt: string;
}

export interface CompletedActivity {
  id: string;
  type: 'breathing' | 'grounding' | 'journal' | 'assessment';
  title: string;
  completedAt: string;
  durationMinutes: number;
}
