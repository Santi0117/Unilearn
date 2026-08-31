export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const colors = [
    'bg-orange-500', 'bg-orange-500', 'bg-emerald-500', 'bg-rose-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}
