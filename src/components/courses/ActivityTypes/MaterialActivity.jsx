import { FileText, Eye, CheckCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

export default function MaterialActivity({ activity }) {
  const { user } = useAuth();
  const { materialViews, markMaterialViewed } = useApp();
  const [expanded, setExpanded] = useState(false);

  const viewed = materialViews.some(v => v.userId === user.id && v.activityId === activity.id);

  const handleView = () => {
    markMaterialViewed(user.id, activity.id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Material</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              {viewed && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle size={11} /> Visto
                </span>
              )}
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{activity.description?.slice(0, 80)}...</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in">
          <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
          {activity.fileName && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{activity.fileName}</div>
                {activity.fileSize && <div className="text-xs text-gray-400">{activity.fileSize}</div>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleView}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Eye size={13} /> Ver
                </button>
                <button
                  onClick={handleView}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  <Download size={13} /> Descargar
                </button>
              </div>
            </div>
          )}
          {!viewed && (
            <button onClick={handleView}
              className="text-sm text-blue-600 hover:underline">
              Marcar como visto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
