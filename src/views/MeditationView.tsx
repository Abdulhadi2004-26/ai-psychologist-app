import React, { useState, useEffect } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Eye,
  Hand,
  Ear,
  Smile,
  Heart,
  Shield,
  Activity
} from 'lucide-react';
import { ambientAudio } from '../utils/audioPlayer';
import { CompletedActivity } from '../types';

interface MeditationViewProps {
  onLogActivity: (activity: CompletedActivity) => void;
}

type BreathingTechnique = 'box' | 'relax478';

export const MeditationView: React.FC<MeditationViewProps> = ({ onLogActivity }) => {
  const [activeTechnique, setActiveTechnique] = useState<BreathingTechnique>('box');
  const [isActive, setIsActive] = useState(false);
  const [cyclePhase, setCyclePhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [activeAmbient, setActiveAmbient] = useState<'rain' | 'stream' | null>(null);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = [
    {
      num: 5,
      title: '5 Things You Can See',
      desc: 'Look around your physical space. Acknowledge 5 specific objects without judging them (e.g. a leaf, the texture of a desk, light on a wall).',
      icon: Eye,
    },
    {
      num: 4,
      title: '4 Things You Can Physically Feel',
      desc: 'Notice 4 physical sensations: the soles of your feet on the floor, fabric against your skin, gravity anchoring you.',
      icon: Hand,
    },
    {
      num: 3,
      title: '3 Things You Can Hear',
      desc: 'Listen for 3 distinct ambient sounds: distant traffic, the gentle hum of an appliance, or your own breath.',
      icon: Ear,
    },
    {
      num: 2,
      title: '2 Things You Can Smell',
      desc: 'Notice 2 scents in the air, or recall a favorite soothing aroma like fresh lavender or brewing tea.',
      icon: Smile,
    },
    {
      num: 1,
      title: '1 Thing You Can Taste or Appreciate',
      desc: 'Take a sip of water or name one supportive truth: You are safe in this present moment.',
      icon: Heart,
    },
  ];

  // Box Breathing cycle: Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s
  // 4-7-8 Breathing cycle: Inhale 4s -> Hold 7s -> Exhale 8s
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Advance to next phase
          if (activeTechnique === 'box') {
            if (cyclePhase === 'Inhale') {
              setCyclePhase('Hold');
              ambientAudio.playChime(528);
              return 4;
            } else if (cyclePhase === 'Hold') {
              setCyclePhase('Exhale');
              ambientAudio.playChime(432);
              return 4;
            } else if (cyclePhase === 'Exhale') {
              setCyclePhase('Rest');
              ambientAudio.playChime(396);
              return 4;
            } else {
              setCyclePhase('Inhale');
              setCyclesCompleted((c) => c + 1);
              ambientAudio.playChime(528);
              return 4;
            }
          } else {
            // 4-7-8 technique
            if (cyclePhase === 'Inhale') {
              setCyclePhase('Hold');
              ambientAudio.playChime(528);
              return 7;
            } else if (cyclePhase === 'Hold') {
              setCyclePhase('Exhale');
              ambientAudio.playChime(432);
              return 8;
            } else {
              setCyclePhase('Inhale');
              setCyclesCompleted((c) => c + 1);
              ambientAudio.playChime(528);
              return 4;
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, cyclePhase, activeTechnique]);

  // Ambient sound handler
  const toggleAmbient = (type: 'rain' | 'stream') => {
    if (activeAmbient === type) {
      ambientAudio.stopSound();
      setActiveAmbient(null);
    } else {
      ambientAudio.playSound(type, 0.25);
      setActiveAmbient(type);
    }
  };

  const handleStopAndLog = () => {
    setIsActive(false);
    if (cyclesCompleted >= 2) {
      onLogActivity({
        id: `act_${Date.now()}`,
        type: 'breathing',
        title: activeTechnique === 'box' ? 'Box Breathing (4-4-4-4)' : '4-7-8 Relaxing Breath',
        completedAt: new Date().toISOString(),
        durationMinutes: Math.max(1, Math.round((cyclesCompleted * 16) / 60)),
      });
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCyclePhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  // Dynamic visual circle scale
  let circleScale = 'scale-100';
  let circleColor = 'border-indigo-400 bg-indigo-50/40 text-indigo-900';

  if (cyclePhase === 'Inhale') {
    circleScale = 'scale-125';
    circleColor = 'border-sky-400 bg-sky-50 text-sky-900 shadow-xl';
  } else if (cyclePhase === 'Hold') {
    circleScale = 'scale-125';
    circleColor = 'border-purple-400 bg-purple-50 text-purple-900 shadow-xl';
  } else if (cyclePhase === 'Exhale') {
    circleScale = 'scale-90';
    circleColor = 'border-teal-400 bg-teal-50 text-teal-900';
  } else if (cyclePhase === 'Rest') {
    circleScale = 'scale-90';
    circleColor = 'border-slate-300 bg-slate-50 text-slate-700';
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/meditation_sanctuary_1792171385532.jpg"
          alt="Zen stones with water ripple"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-1">
          <div className="text-xs font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" /> Somatic Nervous System Regulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Breathing & Grounding Sanctuary</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Regulate your heart rate variability and down-regulate physical stress responses in real-time.
          </p>
        </div>
      </div>

      {/* Ambient Sound Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-800">Soothing Ambient Soundscapes:</span>
          <span className="text-xs text-slate-500">Synthesized locally in your browser</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAmbient('rain')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activeAmbient === 'rain'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {activeAmbient === 'rain' ? 'Pause Rain' : 'Gentle Rain'}
          </button>
          <button
            onClick={() => toggleAmbient('stream')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activeAmbient === 'stream'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {activeAmbient === 'stream' ? 'Pause Stream' : 'Forest Stream'}
          </button>
          {activeAmbient && (
            <button
              onClick={() => {
                ambientAudio.stopSound();
                setActiveAmbient(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700"
              title="Stop sound"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Breathing Arena */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center space-y-8 min-h-[460px]">
        {/* Technique Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTechnique('box');
              handleReset();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTechnique === 'box'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
          <button
            onClick={() => {
              setActiveTechnique('relax478');
              handleReset();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTechnique === 'relax478'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4-7-8 Relaxing Breath
          </button>
        </div>

        {/* Breathing Circle Visualizer */}
        <div className="relative flex items-center justify-center w-72 h-72">
          {/* Subtle outer halo rings */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-dashed border-slate-200 transition-transform duration-1000 ${
              isActive ? 'animate-spin-slow' : ''
            }`}
          />

          {/* Central Animated Breathing Core */}
          <div
            className={`w-52 h-52 rounded-full border-4 flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 transform ease-in-out ${circleScale} ${circleColor}`}
          >
            <div className="text-xs uppercase font-bold tracking-widest opacity-75 mb-1">
              {isActive ? cyclePhase : 'Ready'}
            </div>
            <div className="text-4xl font-extrabold tabular-nums tracking-tight">
              {isActive ? secondsLeft : '4'}
            </div>
            <div className="text-[11px] font-medium opacity-80 mt-1 max-w-[120px]">
              {isActive
                ? cyclePhase === 'Inhale'
                  ? 'Breathe gently in'
                  : cyclePhase === 'Hold'
                  ? 'Suspend breath with ease'
                  : cyclePhase === 'Exhale'
                  ? 'Slow, soft release'
                  : 'Gentle pause'
                : 'Press Begin to Start'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {!isActive ? (
              <button
                onClick={() => {
                  setIsActive(true);
                  ambientAudio.playChime(528);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                Begin Breathing Session
              </button>
            ) : (
              <button
                onClick={handleStopAndLog}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                <Pause className="w-4 h-4" />
                Pause & Log Session
              </button>
            )}

            <button
              onClick={handleReset}
              title="Reset breath timer"
              className="p-3 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-500 tabular-nums">
            Cycles Completed: <span className="font-bold text-slate-900">{cyclesCompleted}</span>
            {cyclesCompleted > 0 && ` (approx. ${Math.round((cyclesCompleted * 16) / 60)} mins)`}
          </div>
        </div>
      </div>

      {/* 5-4-3-2-1 Sensory Grounding Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Anxiety & Panic De-escalation
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Interactive 5-4-3-2-1 Grounding Protocol
            </h2>
            <p className="text-xs text-slate-500">
              When thoughts spin out of control, this sensory sequence brings your brain back into present reality.
            </p>
          </div>
          <button
            onClick={() => {
              onLogActivity({
                id: `act_${Date.now()}`,
                type: 'grounding',
                title: '5-4-3-2-1 Sensory Grounding',
                completedAt: new Date().toISOString(),
                durationMinutes: 5,
              });
              setGroundingStep(0);
            }}
            className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-semibold transition-colors self-start sm:self-auto"
          >
            Mark Grounding Complete
          </button>
        </div>

        {/* Interactive Step Card */}
        <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              {groundingSteps[groundingStep].num}
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                {groundingSteps[groundingStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed max-w-xl">
                {groundingSteps[groundingStep].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setGroundingStep((prev) => (prev > 0 ? prev - 1 : prev))}
              disabled={groundingStep === 0}
              className="px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-40 hover:bg-white rounded-lg border border-slate-200 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setGroundingStep((prev) => (prev < groundingSteps.length - 1 ? prev + 1 : 0))
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              {groundingStep === groundingSteps.length - 1 ? 'Start Over' : 'Next Sense →'}
            </button>
          </div>
        </div>

        {/* Dots indicating progress */}
        <div className="flex justify-center gap-2 pt-2">
          {groundingSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setGroundingStep(i)}
              className={`h-2 rounded-full transition-all ${
                groundingStep === i ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
