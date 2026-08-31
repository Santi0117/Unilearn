import { ExternalLink, Video, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { fmtDateTime } from '../../../utils/dateUtils';

export default function LinkActivity({ activity }) {
  const [expanded, setExpanded] = useState(false);

  const statusColor = {
    upcoming: 'bg-orange-100 text-orange-700',
    live: 'bg-red-100 text-red-700',
    finished: 'bg-gray-100 text-gray-600',
  };

  const statusLabel = {
    upcoming: '🔔 Próxima',
    live: '🔴 En vivo ahora',
    finished: '✅ Finalizada',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Video size={18} className="text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Sesión Sincrónica</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[activity.status] || statusColor.finished}`}>
                {statusLabel[activity.status] || '✅ Finalizada'}
              </span>
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
            <span>{activity.platform}</span>
            {activity.scheduledAt && <span>· {fmtDateTime(activity.scheduledAt)}</span>}
            {activity.duration && <span>· {activity.duration} min</span>}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in">
          {activity.description && <p className="text-sm text-gray-600 mb-3">{activity.description}</p>}
          <a
            href={activity.meetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activity.status === 'live'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : activity.status === 'upcoming'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <ExternalLink size={14} />
            {activity.status === 'live' ? '¡Unirse ahora!' : activity.status === 'upcoming' ? 'Agregar al calendario' : 'Ver grabación'}
          </a>
        </div>
      )}
    </div>
  );
}
