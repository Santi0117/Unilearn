import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { gradeBg, gradeColor, passes } from '../../utils/gradeUtils';
import { fmtDate } from '../../utils/dateUtils';
import { Edit2, Save, X, Award, BookOpen, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { getMyCourses, getStudentGrades, badges } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', bio: user.bio || '' });

  const myCourses = getMyCourses(user.id, user.role);
  const myBadges = badges.filter(b => b.studentId === user.id);

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
  };

  // Academic history for students
  const courseHistory = user.role === 'student'
    ? myCourses.map(c => {
        const { weighted } = getStudentGrades(c.id, user.id);
        return { ...c, grade: weighted };
      })
    : [];

  const avgGrade = courseHistory.length > 0
    ? Math.round(courseHistory.reduce((s, c) => s + (c.grade || 0), 0) / courseHistory.length)
    : null;

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <h1 data-testid="profile-title" className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile card */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="xl" />
                <div>
                  {editing ? (
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      data-testid="profile-name-input"
                      className="text-lg font-bold text-gray-900 border-b border-blue-400 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <h2 data-testid="profile-name" className="text-xl font-bold text-gray-900">{user.name}</h2>
                  )}
                  <p data-testid="profile-email" className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {user.role === 'professor' ? `${user.degree} · ${user.department}`
                      : user.role === 'student' ? `${user.career} · ID: ${user.studentId}`
                      : user.title}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button size="sm" onClick={handleSave} data-testid="profile-save"><Save size={13} /> Guardar</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)} data-testid="profile-cancel"><X size={13} /></Button>
                  </>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => setEditing(true)} data-testid="profile-edit">
                    <Edit2 size={13} /> Editar
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Teléfono</label>
                {editing ? (
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+506 0000-0000"
                    data-testid="profile-phone-input"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <span data-testid="profile-phone" className="text-sm text-gray-700">{user.phone || '—'}</span>
                )}
              </div>
              {user.role === 'student' && (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Período de ingreso</label>
                  <span className="text-sm text-gray-700">{user.entryPeriod}</span>
                </div>
              )}
              {user.role === 'professor' && (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Horario de consulta</label>
                  <span className="text-sm text-gray-700">{user.officeHours}</span>
                </div>
              )}
            </div>

            {(user.bio || editing) && (
              <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 block mb-1">Sobre mí</label>
                {editing ? (
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    rows={3} placeholder="Cuéntanos sobre ti..."
                    data-testid="profile-bio-input"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                ) : (
                  <p data-testid="profile-bio" className="text-sm text-gray-600">{user.bio}</p>
                )}
              </div>
            )}
          </div>

          {/* Badges */}
          {user.role === 'student' && myBadges.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900">Logros</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic history */}
          {user.role === 'student' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-orange-500" />
                <h3 className="font-semibold text-gray-900">Historial Académico</h3>
              </div>
              <div className="overflow-x-auto">
                <table data-testid="profile-history" className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 font-medium text-gray-500 text-xs">Curso</th>
                      <th className="text-center py-2 font-medium text-gray-500 text-xs">Nota</th>
                      <th className="text-center py-2 font-medium text-gray-500 text-xs">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseHistory.map(c => (
                      <tr key={c.id} data-testid="history-row" className="border-b border-gray-50">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                            <span className="font-medium text-gray-800">{c.name}</span>
                          </div>
                          <span className="text-xs text-gray-400 ml-4">{c.code}</span>
                        </td>
                        <td className={`py-2.5 text-center font-bold ${gradeColor(c.grade)}`}>
                          {c.grade > 0 ? `${c.grade}/100` : 'En curso'}
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.grade > 0 ? gradeBg(c.grade) : 'bg-orange-100 text-orange-700'}`}>
                            {c.grade > 0 ? (passes(c.grade) ? 'Aprobado' : 'Reprobado') : 'En curso'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {user.role === 'student' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Promedio general</h3>
                </div>
                <div data-testid="profile-average" className={`text-4xl font-bold ${gradeColor(avgGrade)}`}>
                  {avgGrade || '—'}
                </div>
                <div className="text-sm text-gray-400 mt-1">de 100 puntos</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Créditos</h3>
                <div className="text-2xl font-bold text-gray-900">{user.credits?.earned}</div>
                <div className="text-xs text-gray-400">de {user.credits?.required} requeridos</div>
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, (user.credits?.earned / user.credits?.required) * 100)}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {Math.round((user.credits?.earned / user.credits?.required) * 100)}% completado
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Cambiar contraseña</h3>
            <p className="text-xs text-gray-400 mb-3">Por seguridad, usa al menos 8 caracteres.</p>
            <input type="password" placeholder="Nueva contraseña" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2" />
            <Button size="sm" variant="secondary" className="w-full justify-center">Actualizar contraseña</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
