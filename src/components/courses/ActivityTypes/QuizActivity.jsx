import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, Timer, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { fmtDateTime, isOverdue, isFutureDate } from '../../../utils/dateUtils';
import { gradeBg } from '../../../utils/gradeUtils';

export default function QuizActivity({ activity, courseId }) {
  const { user } = useAuth();
  const { getSubmission, submitQuiz } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(activity.timeLimit * 60);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);

  const submission = user.role === 'student' ? getSubmission(activity.id, user.id) : null;
  const isGraded = !!submission?.grade;
  const notAvailable = activity.closeAt && isOverdue(activity.closeAt);
  const notStarted = activity.openAt && isFutureDate(activity.openAt);

  const handleFinish = useCallback(() => {
    const s = submitQuiz(activity.id, courseId, user.id, answers, activity);
    setScore(s);
    setQuizDone(true);
  }, [answers, activity, courseId, user.id, submitQuiz]);

  useEffect(() => {
    if (!showQuiz || quizDone) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showQuiz, quizDone, handleFinish]);

  const openQuiz = () => {
    setAnswers({});
    setTimeLeft(activity.timeLimit * 60);
    setQuizDone(false);
    setScore(null);
    setCurrentQ(0);
    setShowQuiz(true);
  };

  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  const timerUrgent = timeLeft < 300;

  const q = activity.questions?.[currentQ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <HelpCircle size={18} className="text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Quiz</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isGraded && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gradeBg(submission.grade)}`}>
                  {submission.grade}/100
                </span>
              )}
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-gray-400">
            <span><Timer size={11} className="inline mr-1" />{activity.timeLimit} min</span>
            <span>{activity.questions?.length} preguntas</span>
            <span>{activity.points} pts</span>
            {activity.closeAt && <span>Cierra: {fmtDateTime(activity.closeAt)}</span>}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in space-y-3">
          <p className="text-sm text-gray-600">{activity.instructions}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>• {activity.attempts} intento{activity.attempts > 1 ? 's' : ''} permitido{activity.attempts > 1 ? 's' : ''}</span>
            {activity.showResultImmediately && <span>• Resultado inmediato</span>}
          </div>

          {user.role === 'student' && (
            <div className="pt-2">
              {isGraded ? (
                <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <Trophy size={20} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <div className={`text-xl font-bold ${submission.grade >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {submission.grade}/100
                    </div>
                    <div className="text-xs text-gray-500">Completado el {fmtDateTime(submission.submittedAt)}</div>
                  </div>
                </div>
              ) : notStarted ? (
                <Button size="sm" disabled>No disponible aún — abre {fmtDateTime(activity.openAt)}</Button>
              ) : notAvailable ? (
                <Button size="sm" disabled variant="secondary">El quiz ya cerró</Button>
              ) : (
                <Button size="sm" onClick={openQuiz} variant="purple">
                  <HelpCircle size={14} /> Comenzar quiz
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quiz Modal */}
      <Modal isOpen={showQuiz} onClose={() => {}} size="lg" title={null}>
        <div className="p-6">
          {quizDone ? (
            <div className="text-center py-8 fade-in">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: score >= 70 ? '#d1fae5' : '#fee2e2' }}>
                {score >= 70 ? <Trophy size={36} className="text-emerald-500" /> : <AlertCircle size={36} className="text-red-500" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{score}/100</h3>
              <p className={`mt-1 font-medium ${score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                {score >= 70 ? '¡Aprobado!' : 'No aprobado'}
              </p>
              <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                {activity.showResultImmediately ? `Obtuviste ${score} de 100 puntos.` : 'Tu resultado se mostrará cuando el profesor lo habilite.'}
              </p>
              <Button className="mt-6" onClick={() => setShowQuiz(false)}>Cerrar</Button>
            </div>
          ) : (
            <>
              {/* Timer & progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  Pregunta {currentQ + 1} de {activity.questions?.length}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm ${timerUrgent ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                  <Timer size={14} />
                  {m}:{s}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
                <div className="h-1.5 bg-orange-500 rounded-full transition-all"
                  style={{ width: `${((currentQ) / activity.questions.length) * 100}%` }} />
              </div>

              {q && (
                <div className="space-y-4 fade-in">
                  <p className="font-medium text-gray-900">{q.text}</p>
                  {q.type === 'multiple' && (
                    <div className="space-y-2">
                      {q.options.map(opt => (
                        <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === opt.id ? 'border-purple-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[q.id] === opt.id ? 'border-purple-500' : 'border-gray-300'}`}>
                            {answers[q.id] === opt.id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                          </div>
                          <span className="text-sm text-gray-700">{opt.text}</span>
                          <input type="radio" className="sr-only" name={q.id} value={opt.id}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))} />
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'truefalse' && (
                    <div className="flex gap-3">
                      {[true, false].map(v => (
                        <label key={String(v)} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === v ? 'border-purple-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" className="sr-only" onChange={() => setAnswers(prev => ({ ...prev, [q.id]: v }))} />
                          <span className="font-medium text-sm">{v ? 'Verdadero' : 'Falso'}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
                  Anterior
                </Button>
                {currentQ < activity.questions.length - 1 ? (
                  <Button size="sm" variant="purple" onClick={() => setCurrentQ(currentQ + 1)}>
                    Siguiente
                  </Button>
                ) : (
                  <Button size="sm" variant="success" onClick={handleFinish}>
                    <CheckCircle size={14} /> Finalizar quiz
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
