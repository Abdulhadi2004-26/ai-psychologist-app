# MindEase - AI Mental Wellness & Support Companion

MindEase is an empathetic, professional, and privacy-focused mental wellness companion web application designed to offer emotional support, stress management tools, mood tracking, guided breathing exercises, and a safe, non-judgmental space to reflect.

---

## 🌟 Core Features

1. **Conversational AI Therapy Companion:**
   - Powered server-side by **Gemini 3.8 Flash** via `@google/genai`.
   - Empathetic, validating, and grounded conversational style.
   - Speech synthesis (read-aloud with calm pacing) via Web Speech API.
   - Multi-session history with full-text search, thread creation, and deletion.

2. **Consented AI Memory:**
   - With explicit user permission, retains key personal context (e.g., anxiety triggers, coping preferences, personal goals).
   - Complete user sovereignty: view, add, edit, or purge memories at any time.

3. **Daily Mood & Emotion Tracker:**
   - Record daily moods on a 1–5 scale with descriptive emotion tags and contextual triggers (Work, Sleep, Relationships, Health).
   - Custom interactive SVG timeline curves with hover tooltips and emotion frequency distributions.

4. **Mental Wellness Self-Assessments (Non-Diagnostic):**
   - Evidence-informed questionnaires (PHQ-4 inspired Stress Check, Burnout Balance Index, Sleep Quality).
   - Generates non-diagnostic AI evaluations with identified personal strengths and three actionable self-care recommendations.

5. **Mindful Journaling Sanctuary:**
   - Daily inspirational writing prompt generator.
   - Rich reflection editor with mood tags and keywords.
   - On-demand "Empathetic Reflection" AI assistance.

6. **Somatic Breathing & Grounding:**
   - **Box Breathing (4-4-4-4):** Expanding/contracting visual animation and harmonic chime cues.
   - **4-7-8 Relaxing Breath:** Designed for sleep prep and evening down-regulation.
   - **5-4-3-2-1 Sensory Grounding Protocol:** Interactive step-by-step panic and anxiety de-escalation.
   - **Ambient Soundscapes:** Client-side Web Audio API synthetic gentle rain and forest stream generator (100% offline and resilient).

7. **Safety & Crisis Support:**
   - Automatic distress and self-harm keyword detection in conversational turns.
   - Prominent, persistent 24/7 Crisis Support dialog providing verified emergency resources (988 in US & Canada, 111 / 116 123 in UK, 13 11 14 in Australia, Crisis Text Line, and international directories).
   - User-designated personal emergency contact with direct call integration.

---

## 🛡️ Privacy & Clinical Safety Boundaries

- **Not a Medical Provider:** MindEase provides supportive wellness education and emotional validation. It does **not** diagnose psychiatric conditions, prescribe medications, or replace human psychotherapy.
- **Client-Side Data Ownership:** All personal reflections, chat histories, mood logs, and assessment scores are stored in encrypted browser local storage.
- **Data Portability & Erasure:** Users can export a complete JSON data archive or execute a permanent wipe (Right to Erasure) in Settings.
- **Server-Side API Security:** The `GEMINI_API_KEY` is exclusively accessed server-side via `server.ts` and never exposed to client bundles.

---

## 📂 Project Architecture

```
├── /server.ts              # Full-stack Express server (Gemini API proxy, crisis detection, evaluation)
├── /index.html             # HTML entry point (Plus Jakarta Sans font, metadata)
├── /metadata.json          # App metadata & server-side Gemini capability declaration
├── /.env.example           # Environment template without secrets
├── /src
│   ├── /assets/images      # Calm high-resolution wellness assets (dawn, zen stones, linen journal)
│   ├── /components
│   │   ├── Navbar.tsx      # Top bar (3-zone contract: Brand, nav links, Crisis Support CTA)
│   │   ├── CrisisModal.tsx # Emergency helplines (US, CA, UK, AU, International, personal contact)
│   │   └── OnboardingModal.tsx # Informed consent, clinical boundaries, and memory opt-in
│   ├── /views
│   │   ├── DashboardView.tsx   # Daily greeting, quick mood check-in, primary AI companion CTA
│   │   ├── ChatView.tsx        # Multi-session therapy companion, speech audio, memory drawer
│   │   ├── MoodTrackerView.tsx # Custom SVG mood curve, frequency breakdown, log modal
│   │   ├── AssessmentView.tsx  # Non-diagnostic questionnaires and AI evaluation
│   │   ├── JournalView.tsx     # Mindful journal entries with AI reflections
│   │   ├── MeditationView.tsx  # Interactive Box Breathing, 4-7-8 breath, 5-4-3-2-1 grounding
│   │   ├── ProgressView.tsx    # Consistency streak, mindful minutes, milestone badges
│   │   ├── SettingsView.tsx    # Companion tone, memory manager, export/wipe controls
│   │   └── AuthView.tsx        # Quick demo login and user profile creation
│   ├── /services
│   │   └── storage.ts      # LocalStorage persistence, export/wipe methods, demo seed
│   ├── /utils
│   │   └── audioPlayer.ts  # Web Audio API ambient noise & singing bowl generator
│   ├── /types
│   │   └── index.ts        # TypeScript data definitions
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Tailwind CSS imports and breathing pulse keyframes
│   └── main.tsx            # React 19 entry point
```

---

## 🗄️ Database Schema & Data Models

For local storage or PostgreSQL / Supabase implementations:

```sql
-- User Profile
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    preferred_tone VARCHAR(32) DEFAULT 'empathetic',
    consented_memory_enabled BOOLEAN DEFAULT TRUE,
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Sessions
CREATE TABLE chat_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    is_crisis BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood Entries
CREATE TABLE mood_entries (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
    label VARCHAR(32) NOT NULL,
    emotions TEXT[] DEFAULT '{}',
    triggers TEXT[] DEFAULT '{}',
    energy INT DEFAULT 3,
    notes TEXT
);

-- Journal Entries
CREATE TABLE journal_entries (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mood_tag VARCHAR(32),
    tags TEXT[] DEFAULT '{}',
    ai_reflection TEXT
);

-- User Memories (Consented)
CREATE TABLE user_memories (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(32) CHECK (category IN ('goal', 'preference', 'stressor', 'strength')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Completed Wellness Activities
CREATE TABLE completed_activities (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    title VARCHAR(120) NOT NULL,
    duration_minutes INT DEFAULT 1,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### 2. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Populate `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```
*(Note: If `GEMINI_API_KEY` is not provided, MindEase runs automatically in a rich, empathetic fallback demo mode).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` running Express with Vite middlewares mounted in dev mode.

---

## 🧪 Testing Instructions

1. **AI Chat & Empathy Verification:**
   - Navigate to the **AI Therapy** tab.
   - Send: *"I am feeling anxious about work tomorrow."*
   - Verify the assistant validates your feelings first, offers a calm perspective, and asks one thoughtful question.
   - Click the speaker icon to test Web Speech audio synthesis.
2. **Crisis Detection:**
   - Send: *"I feel like I want to hurt myself."*
   - Verify that the crisis banner is immediately displayed with hotline numbers (988) and supportive de-escalation text.
3. **Mood Tracker & Visual Charts:**
   - Log a mood with score, emotion tags (e.g. Calm, Hopeful), triggers, and energy level.
   - Check that the interactive SVG trend chart updates with the new data point and hover tooltip.
4. **Interactive Box Breathing:**
   - Navigate to the **Breathing** tab.
   - Click "Begin Breathing Session". Watch the 4-phase circle expand on Inhale, pause on Hold, contract on Exhale, and pause on Rest with audio chime notifications.
5. **Data Privacy & Export:**
   - Open **Settings**. Click "Export Data (JSON)". Verify the downloaded file contains complete user logs.

---

## 🚢 Production Build & Deployment

To build the client bundle for production:
```bash
npm run build
```
To run the full-stack server in production:
```bash
npm start
```
MindEase serves the production static build from the `dist/` directory through Express on port 3000.
