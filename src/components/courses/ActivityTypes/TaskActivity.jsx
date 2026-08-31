import { useState } from 'react';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import CountdownTimer from '../../ui/CountdownTimer';
import { fmtDateTime, isOverdue } from '../../../utils/dateUtils';
import { gradeBg } from '../../../utils/gradeUtils';

function RubricTable({ rubric, grades }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 bg-gray-50 font-medium text-gray-600 rounded-tl-lg text-xs">Criterio</th>
            {rubric[0]?.levels.map(l => (
              <th key={l.label} className="text-center p-2 bg-gray-50 font-medium text-gray-600 text-xs last:rounded-tr-lg">
                {l.label} ({l.points}pts)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rubric.map((row, ri) => (
            <tr key={ri} className="border-t border-gray-100">
              <td className="p-2 font-medium text-gray-700 text-xs align-top max-w-32">{row.criterion}</td>
              {row.levels.map((l, li) => (
                <td key={li} className={`p-2 text-center text-xs align-top ${grades?.[ri] === li ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-500'}`}>
                  <div className={`w-4 h-4 rounded-full mx-auto mb-1 border-2 ${grades?.[ri] === li ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`} />
                  <div className="text-xs">{l.desc}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TaskActivity({ activity, courseId }) {
  const { user } = useAuth();
  const { getSubmission, submitTask } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [fileName, setFileName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const isStudent = user.role === 'student';
  const submission = isStudent ? getSubmission(activity.id, user.id) : null;

  const overdue = isOverdue(activity.dueAt);
  const hasSubmission = !!submission;
  const isGraded = hasSubmission && submission.grade !== null;

  const handleSubmit = async () => {
    if (!fileName.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    submitTask(activity.id, courseId, user.id, { fileName, fileSize: '1.2 MB', comment });
    setSubmitting(false);
    setShowSubmit(false);
  };

  const statusChip = () => {
    if (isGraded) return <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${gradeBg(submission.grade)}`}><CheckCircle size={11} /> {submission.grade}/100</span>;
    if (hasSubmission) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700"><Clock size={11} /> Entregada</span>;
    if (overdue) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700"><AlertCircle size={11} /> Vencida</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Clock size={11} /> Pendiente</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Tarea</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isStudent && statusChip()}
              {activity.dueAt && !isGraded && <CountdownTimer dueDate={activity.dueAt} />}
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {activity.dueAt && <span className="text-xs text-gray-400">Vence: {fmtDateTime(activity.dueAt)}</span>}
            {activity.points && <span className="text-xs text-gray-400">{activity.points} pts · {activity.category}</span>}
            {activity.allowLate && !hasSubmission && <span className="text-xs text-amber-600">Permite entregas tardías (-{activity.latePenalty}%)</span>}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in space-y-4">
          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{activity.description}</p>
          </div>

          {/* Instructions (simplified markdown preview) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-800 mb-2">Instrucciones</h5>
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {activity.instructions?.replace(/#{1,3} /g, '').replace(/\*\*/g, '')}
            </div>
          </div>

          {/* Rubric toggle */}
          {activity.rubric && (
            <div>
              <button onClick={() => setShowRubric(!showRubric)}
                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
                {showRubric ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Ver rúbrica de evaluación
              </button>
              {showRubric && (
                <div className="mt-3 fade-in">
                  <RubricTable rubric={activity.rubric} grades={submission?.rubricGrades} />
                </div>
              )}
            </div>
          )}

          {/* Student submission area */}
          {isStudent && (
            <div className="border-t border-gray-100 pt-4">
              {isGraded ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${submission.grade >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {submission.grade}/100
                    </span>
                    <span className="text-sm text-gray-500">Calificado el {fmtDateTime(submission.gradedAt)}</span>
                  </div>
                  {submission.feedback && (
                    <div className="bg-orange-50 rounded-xl p-4 border border-blue-100">
                      <div className="text-xs font-semibold text-orange-700 mb-1">Retroalimentación del docente</div>
                      <p className="text-sm text-gray-700">{submission.feedback}</p>
                    </div>
                  )}
                  {submission.rubricGrades && activity.rubric && (
                    <button onClick={() => setShowFeedback(!showFeedback)}
                      className="text-sm text-orange-600 hover:underline">
                      {showFeedback ? 'Ocultar' : 'Ver'} detalle de rúbrica calificada
                    </button>
                  )}
                  {showFeedback && activity.rubric && (
                    <RubricTable rubric={activity.rubric} grades={submission.rubricGrades} />
                  )}
                </div>
              ) : hasSubmission ? (
                <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <CheckCircle size={18} className="text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-orange-700">Entrega recibida</div>
                    <div className="text-xs text-orange-500">{submission.fileName} · {fmtDateTime(submission.submittedAt)}</div>
                  </div>
                  <Button size="xs" variant="secondary" className="ml-auto" onClick={() => setShowSubmit(true)}>
                    Reemplazar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Aún no has entregado esta tarea</span>
                  <Button size="sm" onClick={() => setShowSubmit(true)} disabled={overdue && !activity.allowLate}>
                    <Upload size={14} /> Entregar tarea
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Modal */}
      <Modal isOpen={showSubmit} onClose={() => setShowSubmit(false)} title="Entregar tarea" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Archivo de entrega</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Ingresa el nombre del archivo</p>
              <input
                value={fileName} onChange={e => setFileName(e.target.value)}
                placeholder="ej. mi_proyecto_tarea1.zip"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Comentarios (opcional)</label>
            <textarea
              value={comment} onChange={e => setComment(e.target.value)}
              rows={3} placeholder="Notas para el profesor..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowSubmit(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!fileName.trim() || submitting}>
              {submitting ? 'Enviando...' : 'Confirmar entrega'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
