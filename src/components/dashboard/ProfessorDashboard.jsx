import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CourseCard from '../courses/CourseCard';
import Avatar from '../ui/Avatar';
import { timeAgo } from '../../utils/dateUtils';
import { gradeColor } from '../../utils/gradeUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { USERS } from '../../data/seedData';

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { getMyCourses, getCourseActivities, getActivitySubmissions, getStudentGrades, submissions, announcements } = useApp();
  const navigate = useNavigate();

  const myCourses = getMyCourses(user.id, 'professor');

  // Aggregate stats
  const totalStudents = new Set(myCourses.flatMap(c => c.studentIds)).size;
  const allActivities = myCourses.flatMap(c => getCourseActivities(c.id));
  const allSubmissions = submissions.filter(s => myCourses.some(c => c.id === s.courseId));
  const ungraded = allSubmissions.filter(s => s.grade === null);

  // Ungraded sorted oldest first
  const ungradedSorted = ungraded
    .map(s => {
      const course = myCourses.find(c => c.id === s.courseId);
      const activity = allActivities.find(a => a.id === s.activityId);
      const student = USERS.find(u => u.id === s.studentId);
      return { ...s, courseName: course?.name, activityTitle: activity?.title, studentName: student?.name };
    })
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    .slice(0, 5);

  // Grade distribution across all courses
  const gradeBuckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  myCourses.forEach(course => {
    course.studentIds.forEach(sid => {
      const { weighted } = getStudentGrades(course.id, sid);
      if (weighted >= 90) gradeBuckets.A++;
      else if (weighted >= 80) gradeBuckets.B++;
      else if (weighted >= 70) gradeBuckets.C++;
      else if (weighted >= 60) gradeBuckets.D++;
      else if (weighted > 0) gradeBuckets.F++;
    });
  });
  const chartData = Object.entries(gradeBuckets).map(([label, count]) => ({ label, count }));

  // At-risk students
  const atRisk = [];
  myCourses.forEach(course => {
    course.studentIds.forEach(sid => {
      const student = USERS.find(u => u.id === sid);
      const { weighted } = getStudentGrades(course.id, sid);
      const stuSubs = allSubmissions.filter(s => s.studentId === sid && s.courseId === course.id);
      const pending = getCourseActivities(course.id).filter(a => a.type === 'task' && !allSubmissions.find(s => s.activityId === a.id && s.studentId === sid));
      if ((weighted > 0 && weighted < 70) || pending.length >= 2) {
        atRisk.push({ student, course, weighted, pendingCount: pending.length });
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hola, {user.name.split(' ')[0]} 👨‍🏫</h1>
        <p className="text-gray-500 text-sm mt-0.5">Panel docente — {myCourses.length} {myCourses.length === 1 ? 'curso' : 'cursos'} activos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard icon={BookOpen} color="blue" label="Cursos activos" value={myCourses.length} />
        <KPICard icon={Users} color="purple" label="Estudiantes" value={totalStudents} />
        <KPICard icon={ClipboardList} color={ungraded.length > 0 ? 'red' : 'green'} label="Sin calificar"
          value={ungraded.length} urgent={ungraded.length > 0} />
        <KPICard icon={TrendingUp} color="green" label="Actividades publicadas" value={allActivities.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Mis Cursos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>

          {/* Grade distribution */}
          {Object.values(gradeBuckets).some(v => v > 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Distribución de calificaciones</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Ungraded urgent */}
          {ungradedSorted.length > 0 && (
            <div className="bg-white rounded-2xl border border-red-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-red-500" />
                <h3 className="font-semibold text-gray-900 text-sm">Pendientes de calificar</h3>
              </div>
              <div className="space-y-2">
                {ungradedSorted.map(s => (
                  <div key={s.id} onClick={() => navigate(`/courses/${s.courseId}/grades`)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-red-50 cursor-pointer transition-colors">
                    <Avatar name={s.studentName || ''} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{s.studentName}</div>
                      <div className="text-xs text-gray-500 truncate">{s.activityTitle}</div>
                      <div className="text-xs text-red-400">{timeAgo(s.submittedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {ungraded.length > 5 && (
                <p className="text-xs text-center text-gray-400 mt-2">+{ungraded.length - 5} más</p>
              )}
            </div>
          )}

          {/* At-risk students */}
          {atRisk.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900 text-sm">Estudiantes en riesgo</h3>
              </div>
              <div className="space-y-2">
                {atRisk.slice(0, 4).map((r, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/50">
                    <Avatar name={r.student?.name || ''} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800">{r.student?.name}</div>
                      <div className="text-xs text-gray-500 truncate">{r.course.name}</div>
                    </div>
                    <div className="text-xs font-bold text-amber-600">
                      {r.weighted > 0 ? `${r.weighted}%` : `${r.pendingCount} pend.`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Actividad reciente</h3>
            <div className="space-y-2">
              {allSubmissions.slice(-5).reverse().map(s => {
                const student = USERS.find(u => u.id === s.studentId);
                const activity = allActivities.find(a => a.id === s.activityId);
                return (
                  <div key={s.id} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-gray-700">{student?.name}</span>
                      <span className="text-xs text-gray-500"> entregó </span>
                      <span className="text-xs text-gray-700 truncate">{activity?.title?.slice(0, 30)}...</span>
                      <div className="text-xs text-gray-400">{timeAgo(s.submittedAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, color, label, value, urgent }) {
  const colors = {
    blue: 'bg-orange-50 text-orange-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className={`bg-white rounded-2xl border p-4 ${urgent ? 'border-red-200' : 'border-gray-100'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div className="text-xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
