import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../data/presentationData';
import { QuizQuestion } from '../types/presentation';
import { Leaderboard } from './Leaderboard';
import {
  saveQuizResultToFirestore,
  subscribeToLeaderboard,
} from '../services/leaderboardService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  Timer,
  User,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const QuizSlide: React.FC = () => {
  // Randomly select 6 questions from the pool
  const getRandomQuestions = (): QuizQuestion[] => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getRandomQuestions());
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<'quiz' | 'ranking'>('quiz');

  // Quiz stopwatch timer
  const [quizTimeSeconds, setQuizTimeSeconds] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Name submission & Firestore saving
  const [userName, setUserName] = useState<string>('');
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Live count for tab pill
  const [liveParticipantCount, setLiveParticipantCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((entries) => {
      setLiveParticipantCount(entries.length);
    });
    return () => unsubscribe();
  }, []);

  // Timer effect: counts seconds while quiz is in progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isQuizFinished) {
      interval = setInterval(() => {
        setQuizTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizFinished]);

  const currentQ = questions[currentQIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const calculateScore = () => {
    return Object.entries(selectedAnswers).filter(([qid, ans]) => {
      const q = questions.find((item) => item.id === Number(qid));
      return q && q.correctAnswer === ans;
    }).length;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return;

    const isCorrect = optionIndex === currentQ.correctAnswer;
    if (isCorrect) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playClick();
    }

    const updated = { ...selectedAnswers, [currentQ.id]: optionIndex };
    setSelectedAnswers(updated);

    // If all 6 questions answered, finish quiz and stop timer
    if (Object.keys(updated).length === totalQuestions) {
      setIsQuizFinished(true);

      const finalScore = Object.entries(updated).filter(([qid, ans]) => {
        const q = questions.find((item) => item.id === Number(qid));
        return q && q.correctAnswer === ans;
      }).length;

      if (finalScore >= 4) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || isSaving) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      soundEffects.playSuccess();
      const finalScore = calculateScore();

      const newId = await saveQuizResultToFirestore({
        name: userName.trim().toUpperCase(),
        score: finalScore,
        totalQuestions,
        timeSeconds: Math.max(1, quizTimeSeconds),
      });

      setSavedEntryId(newId);
      setActiveTab('ranking');
    } catch (err) {
      console.error('Error saving to Firebase:', err);
      setSaveError('No se pudo guardar en la nube. Intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestartQuiz = () => {
    soundEffects.playClick();
    setQuestions(getRandomQuestions());
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setQuizTimeSeconds(0);
    setIsQuizFinished(false);
    setSavedEntryId(null);
    setSaveError(null);
    setActiveTab('quiz');
  };

  const isCurrentAnswered = selectedAnswers[currentQ.id] !== undefined;
  const selectedForCurrent = selectedAnswers[currentQ.id];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-6 animate-fadeIn">
      {/* Quiz Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold uppercase">
              Evaluación Técnica
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
              6 Preguntas Aleatorias
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Banco de Preguntas MPS & CNC
          </h2>
        </div>

        {/* Tab switcher: Quiz vs Ranking */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cuestionario</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('ranking');
              }}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Ranking ({liveParticipantCount})</span>
            </button>
          </div>

          {/* Quiz Timer badge */}
          <div className="bg-slate-950/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 text-xs font-mono text-cyan-300">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(quizTimeSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Tab 1: Quiz Form & Questions */}
      {activeTab === 'quiz' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-5 sm:gap-6">
            {/* Question Station Pill & Number */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono font-medium">
                {currentQ.station}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Pregunta {currentQIndex + 1} de {totalQuestions}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedForCurrent === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let buttonStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';
                if (isCurrentAnswered) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/30';
                  } else if (isSelected) {
                    buttonStyle = 'bg-red-950/50 border-red-500 text-red-200 ring-1 ring-red-500/30';
                  } else {
                    buttonStyle = 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isCurrentAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium cursor-pointer ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-slate-800/80 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isCurrentAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isCurrentAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Banner when answered */}
            {isCurrentAnswered && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300 font-bold block mb-1">
                    Fundamento Técnico de Ingeniería:
                  </strong>
                  {currentQ.explanation}
                </div>
              </div>
            )}

            {/* Bottom Pagination & Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentQIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentQIndex === 0}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                Anterior
              </button>

              {/* Quick dots */}
              <div className="flex items-center gap-1.5">
                {questions.map((q, qidx) => {
                  const ans = selectedAnswers[q.id];
                  let dotColor = 'bg-slate-700';
                  if (ans !== undefined) {
                    dotColor = ans === q.correctAnswer ? 'bg-emerald-400' : 'bg-red-400';
                  }
                  return (
                    <button
                      key={qidx}
                      onClick={() => {
                        soundEffects.playClick();
                        setCurrentQIndex(qidx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${dotColor} ${
                        currentQIndex === qidx ? 'ring-2 ring-cyan-400 scale-125' : ''
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                }}
                disabled={currentQIndex === totalQuestions - 1}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-xs font-bold text-slate-950 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results & Save to Ranking Box (when finished) */}
          {answeredCount === totalQuestions && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Trophy className="w-7 sm:w-8 h-7 sm:h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] sm:text-xs font-mono text-cyan-400 uppercase font-bold">
                      ¡Evaluación Finalizada!
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white">
                      {calculateScore()} de {totalQuestions} Aciertos en {formatTime(quizTimeSeconds)}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Guarda tu resultado con tu nombre para competir en el ranking sincronizado con Firebase.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRestartQuiz}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 shrink-0 border border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nuevas 6 Preguntas</span>
                </button>
              </div>

              {/* Save Score Form */}
              {!savedEntryId ? (
                <form
                  onSubmit={handleSaveResult}
                  className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800"
                >
                  <div className="relative flex-1 w-full">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={userName}
                      disabled={isSaving}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ingresa tu nombre y apellido para el ranking..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer transition"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Guardando en Firebase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar y Ver Ranking</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>¡Puntuación guardada con éxito en Firebase Firestore!</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('ranking')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow"
                  >
                    Ver Tabla de Posiciones
                  </button>
                </div>
              )}

              {saveError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Tab 2: Leaderboard / Ranking View using Dedicated Component */}
      {activeTab === 'ranking' && (
        <Leaderboard
          highlightId={savedEntryId}
          onStartQuiz={handleRestartQuiz}
        />
      )}
    </div>
  );
};
