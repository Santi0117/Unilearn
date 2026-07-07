import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, AlertTriangle, GraduationCap, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/seedData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const enrollmentData = [
  { period: '2024-C1', students: 180 },
  { period: '2024-C2', students: 210 },
  { period: '2024-C3', students: 195 },
  { period: '2025-C1', students: 240 },
  { period: '2025-C2', students: 228 },
  { period: '2025-C3', students: 265 },
];

export default function AdminDashboard() {
  const { courses, submissions, getStudentGrades } = useApp();
  const navigate = useNavigate();

  const students = USERS.filter(u => u.role === 'student');
  const professors = USERS.filter(u => u.role === 'professor');

  // Course performance
  const coursePerf = courses.map(c => {
    let total = 0, count = 0;
    c.studentIds.forEach(sid => {
      const { weighted } = getStudentGrades(c.id, sid);
      if (weighted > 0) { total += weighted; count++; }
    });
    return { name: c.name.split(' ').slice(0, 3).join(' '), avg: count > 0 ? Math.round(total / count) : 0, students: c.studentIds.length };
  });

  return (
    <div className="max-w-7xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-500 text-sm mt-0.5">Universidad CENFOTEC — Vista institucional</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, color: 'blue', label: 'Estudiantes activos', value: students.length },
          { icon: GraduationCap, color: 'purple', label: 'Docentes', value: professors.length },
          { icon: BookOpen, color: 'green', label: 'Cursos activos', value: courses.length },
          { icon: BarChart3, color: 'amber', label: 'Calificaciones registradas', value: submissions.filter(s => s.grade !== null).length },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              { blue: 'bg-blue-50 text-blue-600', purple: 'bg-purple-50 text-purple-600', green: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600' }[color]
            }`}>
              <Icon size={20} />
            </div>
            <div className="text-xl font-bold text-gray-900 mb-0.5">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollment chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Matrículas por período</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentData}>
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course performance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Rendimiento por curso</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coursePerf}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Gestionar Usuarios', desc: 'Estudiantes y docentes', to: '/admin/users', color: 'blue', icon: Users },
          { label: 'Gestionar Cursos', desc: 'Crear, editar, asignar', to: '/admin/courses', color: 'purple', icon: BookOpen },
          { label: 'Ver Reportes', desc: 'Rendimiento institucional', to: '/admin/reports', color: 'green', icon: BarChart3 },
        ].map(item => (
          <button key={item.to} onClick={() => navigate(item.to)}
            className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              { blue: 'bg-blue-100 text-blue-600', purple: 'bg-purple-100 text-purple-600', green: 'bg-emerald-100 text-emerald-600' }[item.color]
            }`}>
              <item.icon size={20} />
            </div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</div>
            <div className="text-sm text-gray-400 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
