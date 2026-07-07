import { useState, useEffect } from 'react';
import { countdown } from '../../utils/dateUtils';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ dueDate, className = '' }) {
  const [info, setInfo] = useState(countdown(dueDate));

  useEffect(() => {
    const t = setInterval(() => setInfo(countdown(dueDate)), 60000);
    return () => clearInterval(t);
  }, [dueDate]);

  const cls = info.overdue
    ? 'text-red-600 bg-red-50'
    : info.urgent
    ? 'text-amber-600 bg-amber-50'
    : 'text-gray-600 bg-gray-50';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      <Clock size={11} />
      {info.label}
    </span>
  );
}
