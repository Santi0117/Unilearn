import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardList, TrendingUp, Clock, Zap, Timer, CheckSquare, Square, Play, Pause } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CourseCard from '../courses/CourseCard';
import CountdownTimer from '../ui/CountdownTimer';
import ProgressBar from '../ui/ProgressBar';
import { countdown, fmtDate, fmtDateTime, periodProgress, timeAgo } from '../../utils/dateUtils';
import { gradeColor } from '../../utils/gradeUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function PomodoroWidget() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const toggle = () => {
    if (running) {
      clearInterval(intervalId);
      setIntervalId(null);
      setRunning(false);
    } else {
      const id = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setRunning(false);
            setIsBreak(b => !b);
            return (isBreak ? 25 : 5) * 60;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      setRunning(true);
    }
  };

  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  const total = (isBreak ? 5 : 25) * 60;
  const pct = ((total - seconds) / total) * 100;
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Pomodoro</div>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="none" stroke={isBreak ? '#10b981' : '#F97316'} strokeWidth="4"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)}
              strokeLinecap="round" className="timer-ring" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">{m}:{s}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${isBreak ? 'text-emerald-600' : 'text-orange-600'}`}>
            {isBreak ? '☕ Descanso' : '📚 Estudio'}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{isBreak ? '5 min' : '25 min'}</div>
          <button onClick={toggle}
            className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${isBreak ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
            {running ? <Pause size={12} /> : <Play size={12} />}
            {running ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getMyCourses, getCourseActivities, getSubmission, getStudentGrades, announcements, periods } = useApp();
  const navigate = useNavigate();

  const [focusMode, setFocusMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const myCourses = getMyCourses(user.id, 'student');
  const activePeriod = periods.find(p => p.isActive);
  const periodPct = activePeriod ? periodProgress(activePeriod.startDate, activePeriod.endDate) : 0;

  // Collect all pending tasks
  const pendingTasks = [];
  myCourses.forEach(course => {
    getCourseActivities(course.id).forEach(act => {
      if ((act.type === 'task' || act.type === 'quiz') && act.dueAt) {
        const sub = getSubmission(act.id, user.id);
        if (!sub) {
          pendingTasks.push({ ...act, courseName: course.name, courseColor: course.color, courseId: course.id });
        }
      }
    });
  });
  pendingTasks.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

  // Overall average
  let totalGrade = 0, gradeCount = 0;
  myCourses.forEach(c => {
    const { weighted } = getStudentGrades(c.id, user.id);
    if (weighted > 0) { totalGrade += weighted; gradeCount++; }
  });
  const avgGrade = gradeCount > 0 ? Math.round(totalGrade / gradeCount) : null;

  // Overdue
  const overdueCount = pendingTasks.filter(t => new Date(t.dueAt) < new Date()).length;

  // Next task
  const nextTask = pendingTasks[0];

  // Announcements for my courses
  const myAnnouncements = announcements
    .filter(a => myCourses.some(c => c.id === a.courseId))
    .slice(0, 3);

  const toggleCheck = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));

  if (focusMode) {
    return (
      <div className="max-w-2xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Modo Enfoque</h1>
            <p className="text-gray-500 text-sm">¿Qué tengo que hacer hoy?</p>
          </div>
          <button onClick={() => setFocusMode(false)} className="text-sm text-orange-600 hover:underline">
            Salir del modo enfoque
          </button>
        </div>
        <div className="space-y-3 mb-6">
          {pendingTasks.slice(0, 8).map(task => {
            const cd = countdown(task.dueAt);
            return (
              <div key={task.id}
                className={`flex items-start gap-3 bg-white rounded-xl border p-4 transition-all ${checkedItems[task.id] ? 'opacity-50 border-gray-100' : 'border-gray-200 shadow-sm'}`}>
                <button onClick={() => toggleCheck(task.id)} className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-orange-500">
                  {checkedItems[task.id] ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${checkedItems[task.id] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{task.courseName}</div>
                </div>
                <CountdownTimer dueDate={task.dueAt} />
              </div>
            );
          })}
          {pendingTasks.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <CheckSquare size={40} className="mx-auto mb-3 text-emerald-400" />
              <div className="font-medium">¡Todo al día!</div>
              <div className="text-sm">No tienes entregas pendientes</div>
            </div>
          )}
        </div>
        <PomodoroWidget />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl mb-6 p-6"
        style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #F97316 50%, #EA580C 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FB923C, transparent)' }} />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FED7AA, transparent)' }} />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 data-testid="dashboard-welcome" className="text-2xl font-bold text-white">
              Bienvenida, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-orange-200 text-sm mt-0.5 capitalize">
              {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
            </p>
          </div>
          <button onClick={() => setFocusMode(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <Zap size={15} />
            Modo Enfoque
          </button>
        </div>
      </div>

      {/* Period progress */}
      {activePeriod && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{activePeriod.label}</span>
            <span className="text-sm text-gray-500">{periodPct}% completado</span>
          </div>
          <ProgressBar value={periodPct} color="violet" size="md" />
        </div>
      )}

      {/* KPI cards */}
      <div data-testid="dashboard-kpis" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard testId="kpi-cursos" icon={BookOpen} color="violet" label="Cursos activos" value={myCourses.length} />
        <KPICard testId="kpi-pendientes" icon={ClipboardList} color={overdueCount > 0 ? 'red' : 'amber'} label="Entregas pendientes"
          value={pendingTasks.length} badge={overdueCount > 0 ? `${overdueCount} vencidas` : null} />
        <KPICard testId="kpi-promedio" icon={TrendingUp} color="green" label="Promedio general"
          value={avgGrade !== null ? `${avgGrade}/100` : '—'} />
        <KPICard testId="kpi-proxima" icon={Clock} color="purple" label="Próxima entrega"
          value={nextTask ? <CountdownTimer dueDate={nextTask.dueAt} /> : 'Sin entregas'} small />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Mis Cursos</h2>
            <button onClick={() => navigate('/courses')} data-testid="dashboard-ver-todos" className="text-sm text-orange-600 hover:underline">Ver todos</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myCourses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Upcoming */}
          <div data-testid="dashboard-proximas-entregas" className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Próximas entregas</h3>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">Sin entregas pendientes 🎉</div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.slice(0, 5).map(task => (
                  <div key={task.id} onClick={() => navigate(`/courses/${task.courseId}`)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: task.courseColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{task.title}</div>
                      <div className="text-xs text-gray-400">{task.courseName}</div>
                    </div>
                    <CountdownTimer dueDate={task.dueAt} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Anuncios recientes</h3>
            {myAnnouncements.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">Sin anuncios</div>
            ) : (
              <div className="space-y-3">
                {myAnnouncements.map(ann => (
                  <div key={ann.id} className="border-l-2 border-orange-500 pl-3">
                    <div className="text-xs font-medium text-gray-800">{ann.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ann.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{timeAgo(ann.postedAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pomodoro */}
          <PomodoroWidget />
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, color, label, value, badge, small, testId }) {
  const colors = {
    violet: { icon: 'text-orange-600', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)' },
    green:  { icon: 'text-emerald-600', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
    amber:  { icon: 'text-amber-600', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
    red:    { icon: 'text-red-600', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
    purple: { icon: 'text-orange-600', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)' },
  };
  const c = colors[color] || colors.violet;
  return (
    <div data-testid={testId} className="rounded-2xl p-4 card-lift" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${c.border}`, boxShadow: `0 2px 12px ${c.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
        <Icon size={20} className={c.icon} />
      </div>
      <div data-testid={testId ? `${testId}-valor` : undefined} className={`font-bold text-gray-900 mb-0.5 ${small ? 'text-base' : 'text-xl'}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {badge && <div className="mt-1.5 inline-flex px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">{badge}</div>}
    </div>
  );
}
