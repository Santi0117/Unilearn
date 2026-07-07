import { useState } from 'react';
import { Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Modal from '../../ui/Modal';
import ProgressBar from '../../ui/ProgressBar';
import { formatDuration } from '../../../utils/dateUtils';

export default function VideoActivity({ activity }) {
  const { user } = useAuth();
  const { videoProgress, updateVideoProgress } = useApp();
  const [showVideo, setShowVideo] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const progress = videoProgress.find(v => v.userId === user.id && v.activityId === activity.id);
  const watched = progress?.watched || 0;
  const total = progress?.total || activity.durationSeconds || 0;
  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
          <Play size={18} className="text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Video</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              {pct === 100 && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Visto ✓</span>}
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
            <span>{activity.duration}</span>
            {user.role === 'student' && pct > 0 && <span>· Visto {pct}%</span>}
          </div>
          {user.role === 'student' && total > 0 && (
            <ProgressBar value={watched} max={total} size="xs" color={pct === 100 ? 'green' : 'blue'} className="mt-2" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in">
          {/* Thumbnail */}
          <div
            onClick={() => setShowVideo(true)}
            className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-3 cursor-pointer group"
          >
            {activity.videoUrl?.includes('youtube') ? (
              <img
                src={`https://img.youtube.com/vi/${activity.videoUrl.split('/').pop()}/hqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {activity.duration}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

          <div className="flex gap-2">
            <button onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Play size={14} /> Ver clase
            </button>
            {activity.videoUrl && activity.videoUrl !== '#' && (
              <a href={activity.videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                <ExternalLink size={14} /> Abrir en YouTube
              </a>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showVideo} onClose={() => setShowVideo(false)} size="xl" title={activity.title}>
        <div className="aspect-video w-full">
          {activity.videoUrl && activity.videoUrl !== '#' ? (
            <iframe
              src={activity.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
              <div className="text-center">
                <Play size={48} className="mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Video no disponible en modo demo</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 text-sm text-gray-500">{activity.description}</div>
      </Modal>
    </div>
  );
}
