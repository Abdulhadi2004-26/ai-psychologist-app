import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize GoogleGenAI client according to instructions
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Crisis keyword detection
const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'end it all',
  'want to die',
  'don\'t want to live',
  'self harm',
  'cutting myself',
  'overdose',
  'hurt myself',
  'better off dead',
  'no reason to live'
];

function detectCrisisLanguage(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

// Base Clinical System Prompt
function buildSystemPrompt(userMemories: string[] = [], tone: string = 'empathetic'): string {
  let prompt = `You are MindEase, an empathetic, non-judgmental AI mental wellness companion and supportive psychologist-style guide.

Core Guidelines & Boundaries:
- You are an emotional support companion. You are NOT a licensed physician, clinical therapist, or emergency service. Never diagnose conditions or prescribe/modify medication.
- Always validate and acknowledge the user's emotional experience first before offering insights or perspectives.
- Speak with warm, grounded, compassionate, and human language. Avoid robotic clichés or toxic positivity.
- Ask at most ONE thoughtful, open-ended question at a time to prevent cognitive overload.
- When appropriate, gently offer small, actionable evidence-based coping tools (such as 4-7-8 breathing, progressive muscle relaxation, CBT cognitive reframing, or the 5-4-3-2-1 grounding technique).
- Respect the user's autonomy and pace. Keep responses supportive, concise (2 to 4 paragraphs maximum), and conversational.
- Communication Tone: ${tone}.`;

  if (userMemories && userMemories.length > 0) {
    prompt += `\n\nConsented User Memory & Context (use this naturally without being intrusive):
${userMemories.map((m) => `- ${m}`).join('\n')}`;
  }

  prompt += `\n\nIf the user expresses self-harm or suicidal thoughts, prioritize immediate safety: express genuine care, acknowledge their pain, encourage reaching out to a human supporter, and remind them that free, confidential crisis hotlines (like 988 in the US/Canada or local equivalents) are ready to support them.`;

  return prompt;
}

// Emulated empathetic fallback for demo mode / when API key is missing
function generateFallbackCompanionResponse(userMessage: string, isCrisis: boolean): string {
  if (isCrisis) {
    return `I hear how much pain you are holding right now, and I want you to know you are not alone. Please remember that your life has worth, and you do not have to carry this immense weight by yourself.

If you are in immediate distress, please connect with someone who can support you right this second:
- In the US and Canada: Call or text 988 (Suicide & Crisis Lifeline, available 24/7 free and confidential).
- In the UK: Call 111 or text SHOUT to 85258.
- International: Visit befrienders.org or iasp.info/resources/Crisis_Centres to find local help.
- You can also reach out to a trusted family member, doctor, or emergency services (911 / 999 / 112).

I am an AI companion and cannot provide emergency intervention, but please stay safe and let a caring person support you today. What is one small, safe thing you can do for yourself right now?`;
  }

  const msg = userMessage.toLowerCase();
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('panic') || msg.includes('worry')) {
    return `I can feel how heavy that anxiety is feeling in this moment. When worry takes over, our nervous system is trying hard to protect us, even if it feels exhausting.

Let's take a slow, gentle breath together right now—in for four counts, and a long, gentle exhale out for six. 

What is the biggest thought that feels like it's driving this worry right now? We can untangle it together, one piece at a time.`;
  }

  if (msg.includes('sad') || msg.includes('depressed') || msg.includes('down') || msg.includes('lonely') || msg.includes('crying')) {
    return `Thank you for sharing that with me. It takes real courage to acknowledge when things feel dark or heavy. I am right here listening, and whatever you are feeling is completely valid.

You don't need to have everything figured out today. Sometimes just letting yourself feel what's there and taking things one hour at a time is enough.

Would it help to talk more about what's been weighing on your heart, or would you prefer a gentle calming exercise?`;
  }

  if (msg.includes('work') || msg.includes('burnout') || msg.includes('stressed') || msg.includes('overwhelmed') || msg.includes('busy')) {
    return `It sounds like you have been carrying a tremendous load lately. Burnout and feeling overwhelmed often happen not because we aren't doing enough, but because we've been trying to hold too much for too long.

Give yourself permission to pause for just this minute. Notice the tension in your shoulders and jaw, and let them soften.

If you could take just one pressure off your plate today, even a small one, what would that be?`;
  }

  return `I hear you, and I appreciate you sharing what is on your mind. It is so important to have a safe, quiet space to process what's happening beneath the surface.

Our thoughts and feelings often tell us what we care about or where we might need extra kindness and rest.

What feels like the most important part of this for you right now?`;
}

// API Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiAvailable: !!aiClient,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMemories, tone } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const isCrisis = detectCrisisLanguage(lastMessage.content || '');

    // Check if GoogleGenAI is available
    if (!aiClient) {
      const fallbackReply = generateFallbackCompanionResponse(lastMessage.content, isCrisis);
      res.json({
        reply: fallbackReply,
        isCrisis,
        demoMode: true,
        source: 'MindEase Supportive Fallback Companion',
      });
      return;
    }

    const systemInstruction = buildSystemPrompt(userMemories, tone);

    // Format previous turns for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || generateFallbackCompanionResponse(lastMessage.content, isCrisis);

      res.json({
        reply: replyText,
        isCrisis,
        demoMode: false,
        source: 'Gemini 3.8 Flash',
      });
    } catch (genError) {
      console.error('Gemini generation error, falling back:', genError);
      const fallbackReply = generateFallbackCompanionResponse(lastMessage.content, isCrisis);
      res.json({
        reply: fallbackReply,
        isCrisis,
        demoMode: true,
        source: 'MindEase Supportive Fallback (API error recovery)',
      });
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error processing chat' });
  }
});

// Assessment evaluation endpoint
app.post('/api/assessment/evaluate', async (req: Request, res: Response) => {
  try {
    const { assessmentType, answers, totalScore } = req.body;

    if (!aiClient) {
      res.json({
        demoMode: true,
        summary: `Thank you for completing this self-check. Your responses indicate a total score of ${totalScore}. Remember, this is an educational reflection tool, not a clinical assessment.`,
        strengths: 'You showed proactive awareness by taking time to reflect on your state.',
        recommendedActions: [
          'Practice a 5-minute box breathing session today.',
          'Schedule a 15-minute unplugged relaxation window.',
          'Write down one gentle affirmation in your journal.',
        ],
      });
      return;
    }

    const prompt = `You are MindEase mental wellness assistant. The user took an optional, non-diagnostic wellness assessment (${assessmentType}).
Their answers: ${JSON.stringify(answers)}
Score summary: ${totalScore}.

Provide a supportive, empathetic 3-paragraph summary:
1. Warm validation, explaining what these patterns may reflect in terms of current stress or energy, reinforcing this is NOT a diagnostic evaluation.
2. Two or three gentle, constructive strengths or resilient qualities shown.
3. Three personalized, non-overwhelming self-care practices (e.g. mindfulness, gentle movement, sleep routine adjustments, or speaking with a licensed counselor if feelings are persistent).

Respond in JSON format with fields:
"summary": string,
"strengths": string,
"recommendedActions": string[] (array of 3 strings)`;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        demoMode: false,
        ...parsed,
      });
    } catch (err) {
      console.error('Assessment evaluation error:', err);
      res.json({
        demoMode: true,
        summary: `Thank you for taking the time to check in with yourself. Your score of ${totalScore} reflects current stress or emotional strain you may be experiencing. Be gentle with yourself.`,
        strengths: 'Your willingness to notice your inner state is a vital step toward emotional resilience.',
        recommendedActions: [
          'Take a gentle 10-minute walk without your phone.',
          'Try the 4-7-8 breathing exercise in the meditation tab.',
          'Connect with a trusted friend or professional if things feel persistent.',
        ],
      });
    }
  } catch (error) {
    console.error('Assessment endpoint error:', error);
    res.status(500).json({ error: 'Failed to evaluate assessment' });
  }
});

// Journal reflection assistant
app.post('/api/journal/reflect', async (req: Request, res: Response) => {
  try {
    const { title, content, mood } = req.body;

    if (!aiClient) {
      res.json({
        reflection: `Your reflection shows meaningful honesty and self-awareness. Honoring your mood (${mood || 'present'}) and giving your thoughts voice is a foundational healing practice. Keep being compassionate with your journey.`,
      });
      return;
    }

    const prompt = `The user wrote a journal entry:
Title: "${title || 'Untitled'}"
Mood: "${mood || 'Unspecified'}"
Content: "${content}"

Write a 2-3 sentence empathetic, warm, validating reflection on their entry. Do not give unsolicited advice; instead, gently highlight their emotional courage, resilience, or offer a gentle perspective.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({
      reflection: response.text || 'Thank you for writing down your thoughts. Allowing yourself to express feelings honestly is a powerful act of care.',
    });
  } catch (error) {
    console.error('Journal reflection error:', error);
    res.json({
      reflection: 'Thank you for expressing your thoughts. Giving words to your feelings helps ground and clarify what matters most to you.',
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindEase server running on http://0.0.0.0:${PORT}`);
    console.log(`Gemini API configured: ${aiClient ? 'Yes (Live)' : 'No (Empathetic Demo Mode Active)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
