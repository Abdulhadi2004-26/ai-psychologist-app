import React, { useState } from 'react';
import {
  ClipboardCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { AssessmentDefinition, AssessmentResult } from '../types';

interface AssessmentViewProps {
  pastResults: AssessmentResult[];
  onSaveResult: (result: AssessmentResult) => void;
  onOpenCrisis: () => void;
}

const ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: 'phq_stress_check',
    title: 'Well-Being & Stress Inventory',
    description: 'An educational, non-diagnostic self-reflection tool inspired by evidence-based scales to assess emotional stress and inner tension over the past 2 weeks.',
    timeEstimate: '3-4 mins',
    category: 'General Emotional Health',
    questions: [
      {
        id: 'q1',
        text: 'Over the last 2 weeks, how often have you felt little interest or pleasure in doing things you normally enjoy?',
        options: [
          { label: 'Not at all', score: 0 },
          { label: 'Several days', score: 1 },
          { label: 'More than half the days', score: 2 },
          { label: 'Nearly every day', score: 3 },
        ],
      },
      {
        id: 'q2',
        text: 'How often have you felt nervous, anxious, or on edge without a clear immediate reason?',
        options: [
          { label: 'Not at all', score: 0 },
          { label: 'Several days', score: 1 },
          { label: 'More than half the days', score: 2 },
          { label: 'Nearly every day', score: 3 },
        ],
      },
      {
        id: 'q3',
        text: 'How often have you experienced restless sleep or difficulty unwinding at night?',
        options: [
          { label: 'Not at all', score: 0 },
          { label: 'Several days', score: 1 },
          { label: 'More than half the days', score: 2 },
          { label: 'Nearly every day', score: 3 },
        ],
      },
      {
        id: 'q4',
        text: 'How often have you found it challenging to quiet racing or intrusive thoughts?',
        options: [
          { label: 'Not at all', score: 0 },
          { label: 'Several days', score: 1 },
          { label: 'More than half the days', score: 2 },
          { label: 'Nearly every day', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'burnout_balance',
    title: 'Work & Energy Burnout Balance',
    description: 'Explore the balance between professional demands, emotional energy expenditure, and rest replenishment.',
    timeEstimate: '3 mins',
    category: 'Workplace & Fatigue',
    questions: [
      {
        id: 'bq1',
        text: 'Do you feel emotionally drained when you anticipate the start of your workday?',
        options: [
          { label: 'Rarely or never', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Frequently', score: 2 },
          { label: 'Almost constantly', score: 3 },
        ],
      },
      {
        id: 'bq2',
        text: 'How often do you feel you lack enough uninterrupted time to recharge on weekends or evenings?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Often', score: 2 },
          { label: 'Always', score: 3 },
        ],
      },
      {
        id: 'bq3',
        text: 'Do you find yourself becoming more cynical or disconnected from projects you used to care about?',
        options: [
          { label: 'Not at all', score: 0 },
          { label: 'Mildly', score: 1 },
          { label: 'Moderately', score: 2 },
          { label: 'Significantly', score: 3 },
        ],
      },
    ],
  },
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  pastResults,
  onSaveResult,
  onOpenCrisis,
}) => {
  const [activeAssessment, setActiveAssessment] = useState<AssessmentDefinition | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);

  const startAssessment = (def: AssessmentDefinition) => {
    setActiveAssessment(def);
    setAnswers({});
    setLatestResult(null);
  };

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const isComplete =
    activeAssessment &&
    activeAssessment.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!activeAssessment || !isComplete || isSubmitting) return;

    setIsSubmitting(true);
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = activeAssessment.questions.length * 3;

    let level = 'Minimal Tension';
    const ratio = totalScore / maxScore;
    if (ratio > 0.66) level = 'Elevated Strain';
    else if (ratio > 0.33) level = 'Moderate Strain';
    else level = 'Mild / Balanced';

    try {
      const res = await fetch('/api/assessment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentType: activeAssessment.title,
          answers,
          totalScore,
        }),
      });

      const data = await res.json();

      const newResult: AssessmentResult = {
        id: `asmt_${Date.now()}`,
        assessmentId: activeAssessment.id,
        assessmentTitle: activeAssessment.title,
        date: new Date().toISOString(),
        score: totalScore,
        maxScore,
        level,
        summary: data.summary || `Your total score is ${totalScore} of ${maxScore}. This indicates ${level.toLowerCase()}. Remember that self-reflection is an ongoing practice, not a clinical grade.`,
        strengths: data.strengths || 'You showed courage and mindfulness by taking time to assess where your energy is right now.',
        recommendedActions: data.recommendedActions || [
          'Practice 5 minutes of box breathing today.',
          'Schedule a 20-minute restorative walk outdoors.',
          'Journal one thing you are grateful for.',
        ],
      };

      onSaveResult(newResult);
      setLatestResult(newResult);
      setActiveAssessment(null);
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mental Wellness Self-Assessments</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore structured self-reflection questionnaires to identify patterns in stress, burnout, and emotional balance.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Clinical Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Important Clinical Boundary:</strong> These assessments are educational self-reflection tools designed to build emotional awareness. They are <em>not</em> clinical diagnostic instruments and do not replace a thorough psychiatric or psychological evaluation by a licensed healthcare professional. If you are experiencing acute distress, please use the Crisis Support button.
        </div>
      </div>

      {/* Result View If Just Completed */}
      {latestResult && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Assessment Results
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{latestResult.assessmentTitle}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-indigo-700 tabular-nums">
                {latestResult.score} <span className="text-xs text-slate-400 font-normal">/ {latestResult.maxScore}</span>
              </span>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{latestResult.level}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reflective Summary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {latestResult.summary}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Identified Strengths & Resilience
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-emerald-950">
                {latestResult.strengths}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Recommended Gentle Self-Care Practices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {latestResult.recommendedActions.map((action, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-xs text-slate-800 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setLatestResult(null)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* Active Questionnaire Form */}
      {activeAssessment ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {activeAssessment.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeAssessment.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{activeAssessment.description}</p>
            </div>
            <button
              onClick={() => setActiveAssessment(null)}
              className="text-xs text-slate-500 hover:text-slate-800 p-2"
            >
              Cancel
            </button>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {activeAssessment.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                <div className="text-sm font-semibold text-slate-900">
                  {idx + 1}. {q.text}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.score)}
                        className={`p-3 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {Object.keys(answers).length} of {activeAssessment.questions.length} answered
            </span>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {isSubmitting ? 'Evaluating with Care...' : 'Submit & Receive Reflection'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Assessment Catalog Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASSESSMENTS.map((asmt) => (
            <div
              key={asmt.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-indigo-600">{asmt.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {asmt.timeEstimate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{asmt.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{asmt.description}</p>
                <div className="text-[11px] text-slate-400 mt-3">
                  {asmt.questions.length} reflective prompts · Non-diagnostic self-awareness
                </div>
              </div>

              <button
                onClick={() => startAssessment(asmt)}
                className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Begin Questionnaire <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Past Assessment History */}
      {pastResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Past Self-Assessment Reflections</h3>
          <div className="divide-y divide-slate-100">
            {pastResults.map((res) => (
              <div key={res.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900">{res.assessmentTitle}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(res.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-600">
                    Score: {res.score}/{res.maxScore} · {res.level}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                  {res.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
