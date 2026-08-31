import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Calendar, Bell, User,
  ChevronLeft, GraduationCap, Users, BarChart3,
  LogOut, BookMarked, Zap, X,
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
  const { sidebarOpen, setSidebarOpen, sidebarVisible, setSidebarVisible, unreadCount } = useApp();
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const closeMobile = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setSidebarVisible(false);
    }
  };

  const showLabels = sidebarOpen || !sidebarVisible;

  return (
    <>
      {sidebarVisible && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      <aside
        data-testid="sidebar"
        className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-transform duration-300 overflow-hidden w-64 max-w-[85vw] ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-[72px]'
        } ${!sidebarVisible ? '-translate-x-full' : 'translate-x-0'}`}
        style={{ background: '#0A0A0A', borderRight: '1px solid #1F1F1F' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #F97316, transparent 70%)' }} />
          <div className="absolute top-1/2 -right-16 w-40 h-40 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #EA580C, transparent 70%)' }} />
          <div className="absolute bottom-32 -left-10 w-32 h-32 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #FB923C, transparent 70%)' }} />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid #1F1F1F' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 glow-pulse"
            style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>
            <GraduationCap size={18} className="text-white" />
          </div>
          {showLabels && (
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="text-white font-bold text-base leading-tight tracking-tight">UniLearn</div>
              <div className="text-xs font-medium" style={{ color: '#FB923C' }}>Plataforma Académica</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarVisible(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              data-testid={`nav-${to.replace(/^\//, '').replace(/\//g, '-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.9), rgba(249,115,22,0.7))', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }} />
                  )}
                  <div className="relative flex-shrink-0">
                    <Icon size={18} />
                    {label === 'Notificaciones' && unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  {showLabels && <span className="relative text-sm font-medium">{label}</span>}
                  {!showLabels && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg"
                      style={{ background: 'rgba(234,88,12,0.95)', backdropFilter: 'blur(8px)' }}>
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative flex-shrink-0 p-3 space-y-1"
          style={{ borderTop: '1px solid #1F1F1F' }}>
          {showLabels && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => { navigate('/profile'); closeMobile(); }}>
              <Avatar name={user?.name || ''} size="sm" />
              <div className="min-w-0 flex-1">
                <div data-testid="sidebar-user-name" className="text-white text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs font-medium" style={{ color: '#FB923C' }}>
                  {user?.role === 'professor' ? 'Docente' : user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </div>
              </div>
              <Zap size={12} style={{ color: '#FB923C' }} className="flex-shrink-0" />
            </div>
          )}
          <button onClick={handleLogout}
            data-testid="sidebar-logout"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:bg-rose-500/15 hover:text-rose-400 transition-colors text-sm">
            <LogOut size={16} />
            {showLabels && <span className="text-sm">Cerrar sesión</span>}
          </button>
          <button
            type="button"
            onClick={() => {
              if (sidebarOpen) setSidebarOpen(false);
              else setSidebarVisible(false);
            }}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-white/20 hover:bg-white/5 hover:text-white/60 transition-colors"
            aria-label={sidebarOpen ? 'Contraer menú' : 'Ocultar menú'}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
