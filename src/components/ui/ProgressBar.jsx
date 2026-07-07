export default function ProgressBar({ value = 0, max = 100, color = 'blue', size = 'md', showLabel = false, className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-400',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };
  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{Math.round(pct)}%</span>
          <span className="text-xs text-gray-400">{value}/{max}</span>
        </div>
      )}
    </div>
  );
}
