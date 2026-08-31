export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-orange-100 text-orange-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    purple: 'bg-orange-100 text-orange-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    dot: 'bg-red-500 text-white',
  };
  const sizes = { xs: 'text-xs px-1.5 py-0.5', sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' };
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
