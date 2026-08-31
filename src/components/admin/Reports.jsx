import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/seedData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { gradeColor } from '../../utils/gradeUtils';

const COLORS = ['#10B981', '#2563EB', '#F59E0B', '#EF4444', '#F97316'];

export default function Reports() {
  const { courses, getStudentGrades, submissions } = useApp();

  const students = USERS.filter(u => u.role === 'student');

  // Per-course avg
  const courseData = courses.map(c => {
    let total = 0, count = 0;
    c.studentIds.forEach(sid => {
      const { weighted } = getStudentGrades(c.id, sid);
      if (weighted > 0) { total += weighted; count++; }
    });
    return {
      name: c.code,
      Promedio: count > 0 ? Math.round(total / count) : 0,
      Estudiantes: c.studentIds.length,
    };
  });

  // Submission rate
  const gradedSubs = submissions.filter(s => s.grade !== null);

  // Grade distribution
  const dist = { '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0, '<60': 0 };
  gradedSubs.forEach(s => {
    if (s.grade >= 90) dist['90-100']++;
    else if (s.grade >= 80) dist['80-89']++;
    else if (s.grade >= 70) dist['70-79']++;
    else if (s.grade >= 60) dist['60-69']++;
    else dist['<60']++;
  });
  const distData = Object.entries(dist).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes Institucionales</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Promedio por curso</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Promedio" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Distribución de calificaciones</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={distData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {distData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student ranking */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Rendimiento de estudiantes</h3>
          <button className="text-sm text-orange-600 hover:underline">Exportar CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500 text-xs px-3">Estudiante</th>
                {courses.map(c => <th key={c.id} className="text-center py-2 font-medium text-gray-500 text-xs px-2">{c.code}</th>)}
                <th className="text-center py-2 font-medium text-gray-500 text-xs px-3">Promedio Global</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const grades = courses.map(c => getStudentGrades(c.id, s.id).weighted);
                const validGrades = grades.filter(g => g > 0);
                const globalAvg = validGrades.length > 0 ? Math.round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length) : null;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-800">{s.name}</td>
                    {grades.map((g, i) => (
                      <td key={i} className={`py-2.5 px-2 text-center font-medium ${gradeColor(g)}`}>
                        {g > 0 ? g : '—'}
                      </td>
                    ))}
                    <td className={`py-2.5 px-3 text-center font-bold ${gradeColor(globalAvg)}`}>
                      {globalAvg ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
