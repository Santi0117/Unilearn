import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Calendar, Bell, User, Settings,
  ChevronLeft, ChevronRight, GraduationCap, Users, BarChart3,
  MessageSquare, LogOut, BookMarked,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';

const NAV = {
  student: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { to: '/courses', icon: BookOpen, label: 'Mis Cursos' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    { to: '/notifications', icon: Bell, label: 'Notificaciones' },
    { to: '/profile', icon: User, label: 'Mi Perfil' },
  ],
  professor: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { to: '/courses', icon: BookOpen, label: 'Mis Cursos' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    { to: '/notifications', icon: Bell, label: 'Notificaciones' },
    { to: '/profile', icon: User, label: 'Mi Perfil' },
  ],
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
    { to: '/admin/users', icon: Users, label: 'Usuarios' },
    { to: '/admin/courses', icon: BookMarked, label: 'Cursos' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reportes' },
    { to: '/notifications', icon: Bell, label: 'Notificaciones' },
    { to: '/profile', icon: User, label: 'Mi Perfil' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen, unreadCount } = useApp();
  const navigate = useNavigate();

  const links = NAV[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-[72px]'}`}
      style={{ background: '#0f2744' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-base leading-tight">UniLearn</div>
            <div className="text-blue-300 text-xs">Plataforma Académica</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <div className="relative flex-shrink-0">
              <Icon size={20} />
              {label === 'Notificaciones' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + toggle */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Avatar name={user?.name || ''} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">{user?.name}</div>
              <div className="text-blue-300 text-xs capitalize">{user?.role === 'professor' ? 'Docente' : user?.role === 'admin' ? 'Administrador' : 'Estudiante'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm"
        >
          <LogOut size={18} />
          {sidebarOpen && 'Cerrar sesión'}
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-blue-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
}
