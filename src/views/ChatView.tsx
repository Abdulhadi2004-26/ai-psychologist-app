import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  LifeBuoy,
  MessageCircle,
  Brain,
  X,
  Search,
  Check,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { UserProfile, ChatSession, ChatMessage, UserMemoryItem } from '../types';

interface ChatViewProps {
  user: UserProfile;
  sessions: ChatSession[];
  onSaveSessions: (sessions: ChatSession[]) => void;
  memories: UserMemoryItem[];
  onSaveMemories: (memories: UserMemoryItem[]) => void;
  onOpenCrisis: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  user,
  sessions,
  onSaveSessions,
  memories,
  onSaveMemories,
  onOpenCrisis,
}) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessions.length > 0 ? sessions[0].id : ''
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMemoryInput, setNewMemoryInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Active session
  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Handle Text-To-Speech (Web Speech API)
  const toggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Calm, deliberate pace
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Create new session
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `sess_${Date.now()}`,
      title: 'New Reflection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `Hello ${user.name}. I am here and completely present with you. Whatever you are feeling right now—stress, sadness, curiosity, or uncertainty—is welcome here.\n\nWhat would you like to explore or share today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const updated = [newSession, ...sessions];
    onSaveSessions(updated);
    setCurrentSessionId(newSession.id);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleNewSession();
      return;
    }
    const updated = sessions.filter((s) => s.id !== id);
    onSaveSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated[0].id);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading || !activeSession) return;

    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...activeSession.messages, userMessage];

    // Auto-title session if it's the first user message
    let sessionTitle = activeSession.title;
    if (activeSession.title === 'New Reflection' && activeSession.messages.filter((m) => m.role === 'user').length === 0) {
      sessionTitle = text.slice(0, 32) + (text.length > 32 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title: sessionTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    const newSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    onSaveSessions(newSessions);
    setIsLoading(true);

    try {
      // Gather active consented memories
      const memoryStrings = user.consentedMemoryEnabled ? memories.map((m) => m.content) : [];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userMemories: memoryStrings,
          tone: user.preferredTone,
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "I am listening and here with you. Could you share a little more about what you're feeling?",
        timestamp: new Date().toISOString(),
        isCrisis: data.isCrisis,
        demoMode: data.demoMode,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: new Date().toISOString(),
        messages: [...updatedMessages, assistantMessage],
      };

      onSaveSessions(sessions.map((s) => (s.id === activeSession.id ? finalSession : s)));
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm right here with you. Take a slow, grounding breath. How is your body feeling as you sit with this right now?",
        timestamp: new Date().toISOString(),
        demoMode: true,
      };
      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, fallbackMessage],
      };
      onSaveSessions(sessions.map((s) => (s.id === activeSession.id ? finalSession : s)));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Prompt starter suggestions
  const starterPrompts = [
    'I feel overwhelmed by responsibilities and don\'t know where to start.',
    'I am having trouble sleeping because my mind keeps replaying conversations.',
    'Can you help me reframe self-critical thoughts into something kinder?',
    'I feel isolated and just want a supportive ear without unsolicited advice.',
  ];

  // Add memory manually
  const handleAddMemory = () => {
    if (!newMemoryInput.trim()) return;
    const item: UserMemoryItem = {
      id: `mem_${Date.now()}`,
      content: newMemoryInput.trim(),
      category: 'goal',
      createdAt: new Date().toISOString(),
    };
    onSaveMemories([...memories, item]);
    setNewMemoryInput('');
  };

  // Delete memory
  const handleDeleteMemory = (id: string) => {
    onSaveMemories(memories.filter((m) => m.id !== id));
  };

  // Filter sessions by search
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const hasCrisisInCurrentChat = activeSession?.messages.some((m) => m.isCrisis);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] min-h-[640px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in relative">
      {/* Left Sidebar: Session Threads */}
      <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handleNewSession}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            New Reflection
          </button>
          <button
            onClick={() => setShowMemoryDrawer(!showMemoryDrawer)}
            title="Consented AI Memory"
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showMemoryDrawer
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Brain className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-slate-200/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setCurrentSessionId(s.id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                s.id === currentSessionId
                  ? 'bg-white border border-slate-200 text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{s.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteSession(s.id, e)}
                title="Delete reflection"
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Clinical reminder */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 leading-normal">
          <span className="font-semibold text-slate-700">MindEase Companion:</span> Always listens first. In urgent crisis, please reach out to professional services.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden">
        {/* Active Session Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.companionAvatar || '/src/assets/images/avatar_companion_sage_1792172159412.jpg'}
              alt="MindEase Companion"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-indigo-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 truncate max-w-md">
                  {activeSession?.title || 'Reflection Session'}
                </h2>
                <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                  AI Companion Sage
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {user.preferredTone} approach · {user.consentedMemoryEnabled ? 'Memory Active' : 'Memory Paused'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMemoryDrawer(!showMemoryDrawer)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Context ({memories.length})</span>
            </button>
          </div>
        </div>

        {/* Crisis Alert Banner (if triggered) */}
        {hasCrisisInCurrentChat && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center justify-between text-xs text-rose-800 animate-fade-in">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>We care deeply about your safety. If you are in crisis, free confidential help is ready right now.</span>
            </div>
            <button
              onClick={onOpenCrisis}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm whitespace-nowrap ml-2"
            >
              View 24/7 Lifelines
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeSession?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <img
                    src={user.companionAvatar || '/src/assets/images/avatar_companion_sage_1792172159412.jpg'}
                    alt="MindEase Companion"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-indigo-100 shadow-xs"
                  />
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : msg.isCrisis
                      ? 'bg-rose-50 border border-rose-200 text-slate-800 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  {/* Crisis flag highlight */}
                  {msg.isCrisis && (
                    <div className="mb-2 pb-2 border-b border-rose-200/80 flex items-center justify-between text-xs font-bold text-rose-700">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Crisis Support Resources
                      </span>
                      <button
                        onClick={onOpenCrisis}
                        className="underline hover:text-rose-900"
                      >
                        Open Emergency Contacts
                      </button>
                    </div>
                  )}

                  {/* Message body with paragraphs */}
                  <div className="whitespace-pre-wrap space-y-2">{msg.content}</div>

                  {/* Footer actions for assistant: read aloud */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSpeech(msg.id, msg.content)}
                          title={isSpeaking ? 'Stop voice playback' : 'Listen with calm voice'}
                          className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                            isSpeaking ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      {user.name.charAt(0) || 'U'}
                    </div>
                  )
                )}
              </div>
            );
          })}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl animate-fade-in">
              <img
                src={user.companionAvatar || '/src/assets/images/avatar_companion_sage_1792172159412.jpg'}
                alt="MindEase Companion"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-indigo-100 shadow-xs animate-pulse"
              />
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-500 font-medium ml-1">MindEase is listening carefully...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompt Chips (only if short thread) */}
        {activeSession?.messages.length <= 2 && (
          <div className="px-4 py-2 bg-white/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 border border-indigo-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Share what is on your mind... (Press Enter to send)"
                className="w-full resize-none px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 max-h-32 leading-relaxed"
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-sm transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>MindEase is an empathetic companion. If you are experiencing an acute crisis, click Crisis Support.</span>
            <button
              onClick={onOpenCrisis}
              className="text-rose-600 hover:underline font-medium"
            >
              Need emergency help?
            </button>
          </div>
        </div>
      </div>

      {/* AI Memory Drawer (Consented context management) */}
      {showMemoryDrawer && (
        <div className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col animate-slide-left">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Consented AI Memory</h3>
            </div>
            <button
              onClick={() => setShowMemoryDrawer(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b border-slate-100 text-xs text-slate-600 space-y-1">
            <p>
              These are points you have shared that MindEase remembers to personalize care. You are in full control: edit or delete any memory.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {memories.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No memories recorded yet.
              </div>
            ) : (
              memories.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 space-y-1 group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold capitalize text-[10px] text-purple-700 tracking-wider">
                      {m.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Delete this memory"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Add custom memory */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Add a personal goal or preference:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemoryInput}
                onChange={(e) => setNewMemoryInput(e.target.value)}
                placeholder="e.g. Practicing self-compassion"
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleAddMemory}
                disabled={!newMemoryInput.trim()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
