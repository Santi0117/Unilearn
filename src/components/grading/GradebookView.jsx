import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/seedData';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import ProgressBar from '../ui/ProgressBar';
import { fmtDateTime } from '../../utils/dateUtils';
import { gradeColor, gradeBg, gradeLabel, passes } from '../../utils/gradeUtils';
import { Download, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function GradeModal({ submission, activity, student, onSave, onClose }) {
  const [grade, setGrade] = useState(submission?.grade ?? '');
  const [feedback, setFeedback] = useState(submission?.feedback ?? '');
  const [rubricGrades, setRubricGrades] = useState(submission?.rubricGrades ?? activity.rubric?.map(() => 1) ?? []);
  const [saving, setSaving] = useState(false);

  const rubricTotal = activity.rubric
    ? rubricGrades.reduce((sum, lvl, i) => sum + (activity.rubric[i]?.levels[lvl]?.points || 0), 0)
    : null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onSave(submission.id, Number(grade) || rubricTotal || 0, feedback, rubricGrades);
    setSaving(false);
    onClose();
  };

  return (
    <div className="p-6 space-y-5">
      {/* Student info */}
      <div className="flex items-center gap-3">
        <Avatar name={student?.name || ''} size="md" />
        <div>
          <div className="font-semibold text-gray-900">{student?.name}</div>
          <div className="text-sm text-gray-500">{student?.email}</div>
        </div>
      </div>

      {/* Submission info */}
      {submission?.fileName && (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">{submission.fileName}</div>
            <div className="text-xs text-gray-400">Entregado {fmtDateTime(submission.submittedAt)}</div>
          </div>
          <Button size="xs" variant="secondary"><Download size={12} /> Descargar</Button>
        </div>
      )}
      {submission?.comment && (
        <div className="bg-orange-50 rounded-xl p-3 text-sm text-gray-700">
          <div className="text-xs font-semibold text-orange-600 mb-1">Comentario del estudiante</div>
          {submission.comment}
        </div>
      )}

      {/* Rubric */}
      {activity.rubric?.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-3">Rúbrica de evaluación</div>
          <div className="space-y-3">
            {activity.rubric.map((row, ri) => (
              <div key={ri} className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">{row.criterion}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {row.levels.map((l, li) => (
                    <label key={li} className={`cursor-pointer p-2 rounded-lg border-2 text-center transition-all ${rubricGrades[ri] === li ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" className="sr-only" onChange={() => {
                        const n = [...rubricGrades];
                        n[ri] = li;
                        setRubricGrades(n);
                        if (!grade) setGrade(n.reduce((sum, lvl, i) => sum + (activity.rubric[i]?.levels[lvl]?.points || 0), 0));
                      }} />
                      <div className="text-xs font-semibold text-gray-700">{l.label}</div>
                      <div className="text-xs text-orange-600 font-medium">{l.points}pts</div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {rubricTotal !== null && (
            <div className="mt-2 text-sm font-medium text-gray-700">
              Total rúbrica: <span className={`font-bold ${gradeColor(rubricTotal)}`}>{rubricTotal}/100</span>
            </div>
          )}
        </div>
      )}

      {/* Grade input */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Calificación (0-100)</label>
        <input type="number" min={0} max={100} value={grade} onChange={e => setGrade(e.target.value)}
          className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-lg"
        />
      </div>

      {/* Feedback */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Retroalimentación</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4}
          placeholder="Comentarios detallados para el estudiante..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
        <Button size="sm" onClick={handleSave} disabled={saving || (!grade && rubricTotal === null)}>
          <CheckCircle size={13} />
          {saving ? 'Guardando...' : 'Guardar calificación'}
        </Button>
      </div>
    </div>
  );
}

export default function GradebookView({ course }) {
  const { user } = useAuth();
  const { getCourseActivities, getSubmission, getActivitySubmissions, getStudentGrades, gradeSubmission } = useApp();
  const [gradeModal, setGradeModal] = useState(null);

  const isStudent = user.role === 'student';
  const isProfessor = !isStudent;

  const activities = getCourseActivities(course.id).filter(a => a.points);
  const students = USERS.filter(u => course.studentIds.includes(u.id));

  if (isStudent) {
    const { items, weighted } = getStudentGrades(course.id, user.id);
    const chartData = items.filter(i => i.grade !== null).map(item => ({
      name: item.title.split(' ').slice(0, 3).join(' '),
      Nota: item.grade,
    }));

    return (
      <div className="space-y-6">
        {/* Grade summary */}
        <div data-testid="gradebook-student" className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Calificaciones</h3>
            <div className="flex items-center gap-2">
              <span data-testid="gradebook-weighted" className={`text-2xl font-bold ${gradeColor(weighted)}`}>{weighted || '—'}</span>
              <span className="text-gray-400 text-sm">/100</span>
              {weighted > 0 && (
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${passes(weighted) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {passes(weighted) ? 'Aprobado ✓' : 'No aprobado'}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar value={weighted} max={100} color={weighted >= 70 ? 'green' : weighted >= 60 ? 'amber' : 'red'} showLabel size="md" className="mb-6" />

          {/* Grade table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-500 text-xs">Actividad</th>
                  <th className="text-center py-2 font-medium text-gray-500 text-xs">Categoría</th>
                  <th className="text-center py-2 font-medium text-gray-500 text-xs">Nota</th>
                  <th className="text-center py-2 font-medium text-gray-500 text-xs">Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.activityId} data-testid="gradebook-row" className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-800 text-sm">{item.title}</td>
                    <td className="py-2.5 text-center text-xs text-gray-500">{item.category}</td>
                    <td className={`py-2.5 text-center font-bold ${gradeColor(item.grade)}`}>
                      {item.grade !== null ? `${item.grade}/100` : '—'}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.grade !== null ? gradeBg(item.grade)
                        : item.submittedAt ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.grade !== null ? gradeLabel(item.grade)
                          : item.submittedAt ? 'Entregada'
                          : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Evolución de notas</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Nota" fill={course.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  // Professor gradebook
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Planilla de calificaciones</h3>
          <Button size="xs" variant="secondary"><Download size={13} /> Exportar</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs sticky left-0 bg-gray-50">Estudiante</th>
                {activities.map(a => (
                  <th key={a.id} className="text-center px-3 py-3 font-medium text-gray-600 text-xs max-w-28 truncate">
                    <div className="truncate max-w-24">{a.title.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="text-gray-400 font-normal">{a.points}pts</div>
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-medium text-gray-600 text-xs">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const { items, weighted } = getStudentGrades(course.id, student.id);
                return (
                  <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div className="flex items-center gap-2">
                        <Avatar name={student.name} size="xs" />
                        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{student.name}</span>
                      </div>
                    </td>
                    {activities.map(act => {
                      const sub = getSubmission(act.id, student.id);
                      return (
                        <td key={act.id} className="px-3 py-3 text-center">
                          <button
                            onClick={() => {
                              if (!sub) return;
                              setGradeModal({ submission: sub, activity: act, student });
                            }}
                            className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors min-w-12 ${
                              sub?.grade !== null && sub?.grade !== undefined
                                ? `${gradeBg(sub.grade)} hover:opacity-80 cursor-pointer`
                                : sub
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 cursor-pointer'
                                : 'text-gray-300 cursor-default'
                            }`}
                          >
                            {sub?.grade !== null && sub?.grade !== undefined
                              ? sub.grade
                              : sub
                              ? 'Calificar'
                              : '—'}
                          </button>
                        </td>
                      );
                    })}
                    <td className={`px-4 py-3 text-center font-bold ${gradeColor(weighted)}`}>
                      {weighted > 0 ? weighted : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade modal */}
      {gradeModal && (
        <Modal isOpen={!!gradeModal} onClose={() => setGradeModal(null)}
          title={`Calificar: ${gradeModal.activity.title}`} size="lg">
          <GradeModal
            submission={gradeModal.submission}
            activity={gradeModal.activity}
            student={gradeModal.student}
            onSave={gradeSubmission}
            onClose={() => setGradeModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
