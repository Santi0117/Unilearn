import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Users, BarChart2, MessageSquare, BookOpen,
  Plus, Megaphone, Send, X, FileText, Video, Link2, HelpCircle, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import TaskActivity from './ActivityTypes/TaskActivity';
import QuizActivity from './ActivityTypes/QuizActivity';
import VideoActivity from './ActivityTypes/VideoActivity';
import LinkActivity from './ActivityTypes/LinkActivity';
import MaterialActivity from './ActivityTypes/MaterialActivity';
import ForumActivity from './ActivityTypes/ForumActivity';
import GradebookView from '../grading/GradebookView';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import ProgressBar from '../ui/ProgressBar';
import { USERS } from '../../data/seedData';
import { fmtDateTime, timeAgo } from '../../utils/dateUtils';
import { gradeColor } from '../../utils/gradeUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function WeekTab({ number, active, onClick, hasContent }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active ? 'bg-blue-600 text-white' : hasContent ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-default'
      }`}
    >
      S{number}
    </button>
  );
}

function AddActivityModal({ courseId, week, onClose }) {
  const { addActivity, postAnnouncement } = useApp();
  const { user } = useAuth();
  const [type, setType] = useState('material');
  const [form, setForm] = useState({ title: '', description: '', dueAt: '', points: 100, category: 'Tareas' });
  const [saving, setSaving] = useState(false);

  const TYPES = [
    { id: 'material', label: 'Material', icon: FileText, color: 'emerald' },
    { id: 'video', label: 'Video', icon: Video, color: 'red' },
    { id: 'sync', label: 'Sesión', icon: Link2, color: 'blue' },
    { id: 'task', label: 'Tarea', icon: FileText, color: 'amber' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'purple' },
    { id: 'forum', label: 'Foro', icon: MessageCircle, color: 'cyan' },
  ];

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    addActivity({
      courseId, week, type, visible: true,
      order: 99,
      ...form,
      points: Number(form.points) || 100,
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
      openAt: new Date().toISOString(),
      questions: type === 'quiz' ? [] : undefined,
      rubric: type === 'task' ? [] : undefined,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="p-6 space-y-4">
      {/* Type selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Tipo de actividad</label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-medium ${type === t.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Título *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder={`Título de la ${type === 'task' ? 'tarea' : type === 'quiz' ? 'evaluación' : 'actividad'}`}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Descripción</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          rows={3} placeholder="Descripción breve..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {(type === 'task' || type === 'quiz') && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Fecha límite</label>
            <input type="datetime-local" value={form.dueAt} onChange={e => set('dueAt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Puntos</label>
            <input type="number" value={form.points} onChange={e => set('points', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
        <Button size="sm" onClick={handleSave} disabled={!form.title.trim() || saving}>
          {saving ? 'Guardando...' : 'Publicar actividad'}
        </Button>
      </div>
    </div>
  );
}

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCourse, getWeekActivities, getCourseActivities, getStudentGrades, announcements, postAnnouncement, submissions } = useApp();

  const course = getCourse(courseId);
  const [activeTab, setActiveTab] = useState('course');
  const [activeWeek, setActiveWeek] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  if (!course) return <div className="p-8 text-gray-500">Curso no encontrado</div>;

  const isProfessor = user.role === 'professor' || user.role === 'admin';
  const weekActivities = getWeekActivities(courseId, activeWeek);
  const allActivities = getCourseActivities(courseId);
  const weeksWithContent = new Set(allActivities.map(a => a.week));
  const courseAnnouncements = announcements.filter(a => a.courseId === courseId);

  const students = USERS.filter(u => course.studentIds.includes(u.id));
  const professor = USERS.find(u => u.id === course.professorId);

  const handleAnnounce = () => {
    if (!annTitle.trim()) return;
    postAnnouncement(courseId, user.id, annTitle, annContent);
    setAnnTitle('');
    setAnnContent('');
    setShowAnnounce(false);
  };

  const renderActivity = (act) => {
    const props = { key: act.id, activity: act, courseId };
    if (act.type === 'task') return <TaskActivity {...props} />;
    if (act.type === 'quiz') return <QuizActivity {...props} />;
    if (act.type === 'video') return <VideoActivity {...props} />;
    if (act.type === 'sync') return <LinkActivity {...props} />;
    if (act.type === 'forum') return <ForumActivity {...props} />;
    if (act.type === 'material') return <MaterialActivity {...props} />;
    return null;
  };

  const TABS = [
    { id: 'course', label: 'Curso' },
    { id: 'participants', label: 'Participantes' },
    { id: 'grades', label: 'Calificaciones' },
    { id: 'communication', label: 'Comunicación' },
    ...(isProfessor ? [{ id: 'stats', label: 'Estadísticas' }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Back */}
      <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm">
        <ChevronLeft size={16} /> Mis Cursos
      </button>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: `linear-gradient(135deg, #0f2744, ${course.color})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="text-sm font-medium text-white/60">{course.code}</span>
              <h1 className="text-2xl font-bold text-white mt-1">{course.name}</h1>
              <p className="text-white/70 mt-2 text-sm">{professor?.name}</p>
              <p className="text-white/50 text-sm mt-1">{students.length} estudiantes · {course.credits} créditos</p>
            </div>
            {isProfessor && (
              <button onClick={() => setShowAnnounce(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors backdrop-blur">
                <Megaphone size={16} /> Anuncio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 min-w-fit ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Course ─────────────────────────────────────────────────── */}
      {activeTab === 'course' && (
        <div>
          {/* Week tabs */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-thin flex-wrap">
            {Array.from({ length: course.totalWeeks }, (_, i) => i + 1).map(w => (
              <WeekTab key={w} number={w} active={activeWeek === w} onClick={() => setActiveWeek(w)} hasContent={weeksWithContent.has(w)} />
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Semana {activeWeek}</h2>
            {isProfessor && (
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={14} /> Agregar contenido
              </Button>
            )}
          </div>

          {weekActivities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
              <div className="font-medium text-gray-400">Sin contenido esta semana</div>
              {isProfessor && (
                <Button size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
                  <Plus size={14} /> Agregar primera actividad
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {weekActivities.map(renderActivity)}
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Participants ───────────────────────────────────────────── */}
      {activeTab === 'participants' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Docente</h3>
            {professor && (
              <div className="flex items-center gap-4">
                <Avatar name={professor.name} size="lg" />
                <div>
                  <div className="font-semibold text-gray-900">{professor.title || professor.name}</div>
                  <div className="text-sm text-gray-500">{professor.degree}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{professor.email}</div>
                  {professor.officeHours && (
                    <div className="text-xs text-blue-600 mt-1">Horario de consulta: {professor.officeHours}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Estudiantes ({students.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map(s => {
                const { weighted } = getStudentGrades(courseId, s.id);
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </div>
                    {isProfessor && weighted > 0 && (
                      <span className={`text-sm font-bold ${gradeColor(weighted)}`}>{weighted}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Grades ─────────────────────────────────────────────────── */}
      {activeTab === 'grades' && (
        <GradebookView course={course} />
      )}

      {/* ─── Tab: Communication ──────────────────────────────────────────── */}
      {activeTab === 'communication' && (
        <div className="space-y-5">
          {isProfessor && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Anuncios</h3>
                <Button size="sm" onClick={() => setShowAnnounce(true)}>
                  <Megaphone size={14} /> Nuevo anuncio
                </Button>
              </div>
              {courseAnnouncements.length === 0 ? (
                <p className="text-sm text-gray-400">Sin anuncios publicados</p>
              ) : (
                <div className="space-y-4">
                  {courseAnnouncements.map(ann => (
                    <div key={ann.id} className="border-l-2 border-blue-500 pl-4 py-1">
                      <div className="font-medium text-gray-800">{ann.title}</div>
                      <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">{ann.content}</div>
                      <div className="text-xs text-gray-400 mt-2">{timeAgo(ann.postedAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isProfessor && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Anuncios del docente</h3>
              {courseAnnouncements.length === 0 ? (
                <p className="text-sm text-gray-400">Sin anuncios</p>
              ) : (
                <div className="space-y-4">
                  {courseAnnouncements.map(ann => (
                    <div key={ann.id} className="border-l-2 border-blue-500 pl-4">
                      <div className="font-medium text-gray-800">{ann.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{ann.content}</div>
                      <div className="text-xs text-gray-400 mt-2">{timeAgo(ann.postedAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info profesor */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Contacto del docente</h3>
            {professor && (
              <div className="space-y-2 text-sm text-gray-600">
                <div>📧 {professor.email}</div>
                {professor.phone && <div>📱 {professor.phone}</div>}
                {professor.officeHours && <div>🕐 Horario de consulta: {professor.officeHours}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab: Stats (professor only) ─────────────────────────────────── */}
      {activeTab === 'stats' && isProfessor && (
        <div className="space-y-6">
          {/* Grade evolution per student */}
          {students.map(s => {
            const { items, weighted } = getStudentGrades(courseId, s.id);
            const chartData = items.filter(i => i.grade !== null).map((item, idx) => ({ name: `A${idx + 1}`, grade: item.grade }));
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={s.name} size="sm" />
                  <div>
                    <div className="font-medium text-gray-900">{s.name}</div>
                    <div className={`text-sm font-bold ${gradeColor(weighted)}`}>Promedio: {weighted || '—'}</div>
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="grade" stroke={course.color} strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-gray-400">Sin calificaciones aún</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add activity modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={`Agregar a Semana ${activeWeek}`} size="md">
        <AddActivityModal courseId={courseId} week={activeWeek} onClose={() => setShowAdd(false)} />
      </Modal>

      {/* Announce modal */}
      <Modal isOpen={showAnnounce} onClose={() => setShowAnnounce(false)} title="Publicar anuncio" size="sm">
        <div className="p-6 space-y-4">
          <input value={annTitle} onChange={e => setAnnTitle(e.target.value)}
            placeholder="Título del anuncio"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea value={annContent} onChange={e => setAnnContent(e.target.value)}
            rows={5} placeholder="Contenido del anuncio..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowAnnounce(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleAnnounce} disabled={!annTitle.trim()}>
              <Send size={13} /> Publicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
