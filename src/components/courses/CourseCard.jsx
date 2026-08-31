import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../ui/ProgressBar';
import { countdown } from '../../utils/dateUtils';
import CountdownTimer from '../ui/CountdownTimer';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCourseActivities, getSubmission, submissions } = useApp();

  const activities = getCourseActivities(course.id);
  const taskActivities = activities.filter(a => a.type === 'task' && a.dueAt);

  // Progress: how many activities have been interacted with
  const completed = user?.role === 'student'
    ? activities.filter(a => {
        if (a.type === 'task' || a.type === 'quiz') return !!getSubmission(a.id, user.id)?.grade;
        return false;
      }).length
    : 0;

  const totalGradeable = activities.filter(a => a.type === 'task' || a.type === 'quiz').length;
  const progress = totalGradeable > 0 ? Math.round((completed / totalGradeable) * 100) : 0;

  // Next pending task
  const pending = taskActivities.find(a => {
    const sub = getSubmission(a.id, user?.id);
    return !sub && new Date(a.dueAt) > new Date();
  });

  // For professor: ungraded count
  const ungraded = user?.role === 'professor'
    ? submissions.filter(s => s.courseId === course.id && s.grade === null).length
    : 0;

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      data-testid="course-card"
      data-course-id={course.id}
      data-course-code={course.code}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Banner */}
      <div className="h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${course.color}dd, ${course.color}88)` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-4 border-white/40" />
          <div className="absolute -right-2 top-8 w-20 h-20 rounded-full border-2 border-white/30" />
        </div>
        <div className="absolute bottom-3 left-4">
          <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">{course.code}</span>
        </div>
        {ungraded > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {ungraded} sin calificar
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 data-testid="course-card-name" className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
          {course.name}
        </h3>
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <Users size={11} />
          {course.studentIds.length} estudiantes
        </p>

        {user?.role === 'student' && (
          <>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} color="blue" size="sm" />
            </div>
            {pending && (
              <div className="bg-amber-50 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                <span className="text-xs text-amber-700 truncate">{pending.title}</span>
                <CountdownTimer dueDate={pending.dueAt} />
              </div>
            )}
          </>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{activities.length} actividades</span>
          <span className="text-orange-600 flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all">
            Ir al curso <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
