import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, BookOpen, Star, Clock, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/dateUtils';

const ICONS = {
  announcement: { icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
  grade: { icon: Star, color: 'bg-amber-100 text-amber-600' },
  deadline: { icon: Clock, color: 'bg-red-100 text-red-600' },
  submission: { icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
};

export default function NotificationsPanel() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const navigate = useNavigate();

  const handleClick = (n) => {
    markNotificationRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <CheckCheck size={15} /> Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Bell size={40} className="mx-auto mb-3 text-gray-300" />
            <div className="font-medium text-gray-400">Sin notificaciones</div>
          </div>
        ) : notifications.map(n => {
          const config = ICONS[n.type] || ICONS.announcement;
          const Icon = config.icon;
          return (
            <div key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${n.isRead ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                <span className="text-xs text-gray-400 mt-1 block">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
