import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, FileText, HelpCircle, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { fmtDateTime } from '../../utils/dateUtils';

const ACTIVITY_COLORS = {
  task: { color: 'bg-amber-500', icon: FileText, label: 'Tarea' },
  quiz: { color: 'bg-purple-500', icon: HelpCircle, label: 'Quiz' },
  video: { color: 'bg-red-400', icon: Video, label: 'Video' },
  sync: { color: 'bg-blue-500', icon: Calendar, label: 'Sesión' },
};

export default function CalendarPage() {
  const { user } = useAuth();
  const { getMyCourses, getCourseActivities } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const myCourses = getMyCourses(user.id, user.role);
  const allActivities = myCourses.flatMap(course =>
    getCourseActivities(course.id)
      .filter(a => a.dueAt || a.scheduledAt)
      .map(a => ({ ...a, courseName: course.name, courseColor: course.color }))
  );

  const getEventsForDay = (day) =>
    allActivities.filter(a => {
      const date = new Date(a.dueAt || a.scheduledAt);
      return isSameDay(date, day);
    });

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = startOfMonth(currentMonth).getDay();
  // adjust for Monday start
  const pad = startPad === 0 ? 6 : startPad - 1;

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="max-w-5xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendario Académico</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-semibold text-gray-800 min-w-36 text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: pad }).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const events = getEventsForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <button key={day.toISOString()}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-start pt-1.5 transition-all text-sm ${
                    isSelected ? 'bg-blue-600 text-white' :
                    isToday(day) ? 'bg-blue-50 text-blue-700 font-bold' :
                    !isSameMonth(day, currentMonth) ? 'text-gray-200' :
                    'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-medium">{format(day, 'd')}</span>
                  {events.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center mt-0.5 px-0.5">
                      {events.slice(0, 3).map((e, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : e.type === 'task' ? 'bg-amber-400' : e.type === 'quiz' ? 'bg-purple-500' : 'bg-blue-400'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {Object.entries(ACTIVITY_COLORS).map(([type, { color, label }]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Events panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          {selectedDay ? (
            <>
              <h3 className="font-semibold text-gray-900 mb-1 capitalize">
                {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-gray-400 mt-4">Sin actividades este día</p>
              ) : (
                <div className="space-y-3 mt-3">
                  {selectedEvents.map(event => {
                    const config = ACTIVITY_COLORS[event.type] || ACTIVITY_COLORS.task;
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{event.title}</div>
                          <div className="text-xs text-gray-400">{event.courseName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{fmtDateTime(event.dueAt || event.scheduledAt)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="font-semibold text-gray-900 mb-4">Próximas actividades</h3>
              <div className="space-y-3">
                {allActivities
                  .filter(a => new Date(a.dueAt || a.scheduledAt) >= new Date())
                  .sort((a, b) => new Date(a.dueAt || a.scheduledAt) - new Date(b.dueAt || b.scheduledAt))
                  .slice(0, 8)
                  .map(event => {
                    const config = ACTIVITY_COLORS[event.type] || ACTIVITY_COLORS.task;
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                          <Icon size={12} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-800 truncate">{event.title}</div>
                          <div className="text-xs text-gray-400">{event.courseName}</div>
                          <div className="text-xs text-blue-600">{fmtDateTime(event.dueAt || event.scheduledAt)}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
