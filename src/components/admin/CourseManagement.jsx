import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/seedData';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function CourseManagement() {
  const { courses, getStudentGrades } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
        <Button size="sm"><Plus size={14} /> Nuevo curso</Button>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cursos..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(course => {
          const professor = USERS.find(u => u.id === course.professorId);
          let totalGrade = 0, gradeCount = 0;
          course.studentIds.forEach(sid => {
            const { weighted } = getStudentGrades(course.id, sid);
            if (weighted > 0) { totalGrade += weighted; gradeCount++; }
          });
          const avg = gradeCount > 0 ? Math.round(totalGrade / gradeCount) : null;

          return (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3" style={{ background: course.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="default" className="mb-2">{course.code}</Badge>
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{professor?.name}</p>
                  </div>
                  {avg && (
                    <div className={`text-xl font-bold ${avg >= 70 ? 'text-emerald-600' : 'text-red-500'}`}>{avg}</div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Users size={14} />
                    <span>{course.studentIds.length} estudiantes</span>
                  </div>
                  <button onClick={() => navigate(`/courses/${course.id}`)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    Ver curso <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
