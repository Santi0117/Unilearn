import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, X, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';
import { timeAgo } from '../../utils/dateUtils';

export default function Header() {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markNotificationRead, markAllRead, darkMode, setDarkMode, getMyCourses, sidebarVisible, setSidebarVisible, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const searchRef = useRef(null);

  const myCourses = user ? getMyCourses(user.id, user.role) : [];

  const searchResults = search.length > 1
    ? myCourses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') { setShowSearch(false); setSearch(''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const recent5 = notifications.slice(0, 8);

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 gap-2 sm:gap-4 flex-shrink-0 z-20 sticky top-0">
      {!sidebarVisible && (
        <button
          type="button"
          onClick={() => { setSidebarVisible(true); setSidebarOpen(true); }}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      )}
      <div className="flex-1 min-w-0 max-w-md relative">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            data-testid="header-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => { setShowSearch(false); setSearch(''); }, 150)}
            placeholder="Buscar cursos..."
            className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div data-testid="search-results" className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {searchResults.map(c => (
              <button
                key={c.id}
                data-testid="search-result"
                data-course-id={c.id}
                onMouseDown={() => { navigate(`/courses/${c.id}`); setSearch(''); setShowSearch(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: c.color }}>
                  {c.code.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.code}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            data-testid="header-bell"
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-16 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="text-xs text-orange-600 hover:underline">Marcar todas</button>
                  <button onClick={() => setShowNotifs(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {recent5.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Sin notificaciones</div>
                ) : recent5.map(n => (
                  <button
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); navigate(n.link || '/notifications'); setShowNotifs(false); }}
                    className={`w-full flex gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors ${!n.isRead ? 'bg-orange-50/50' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-800 truncate">{n.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 p-2">
                <button onClick={() => { navigate('/notifications'); setShowNotifs(false); }} className="w-full text-center text-sm text-orange-600 hover:underline py-1">
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            data-testid="header-user-menu"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Avatar name={user?.name || ''} size="sm" />
            <div className="text-left hidden sm:block">
              <div data-testid="header-user-firstname" className="text-sm font-medium text-gray-800 leading-tight">{user?.name?.split(' ')[0]}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role === 'professor' ? 'Docente' : user?.role === 'admin' ? 'Admin' : 'Estudiante'}</div>
            </div>
          </button>
          {showUser && (
            <div data-testid="user-dropdown" className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <div data-testid="dropdown-user-name" className="font-medium text-gray-800">{user?.name}</div>
                <div data-testid="dropdown-user-email" className="text-xs text-gray-400 truncate">{user?.email}</div>
              </div>
              {[
                { label: 'Mi Perfil', to: '/profile' },
                { label: 'Notificaciones', to: '/notifications' },
                { label: 'Calendario', to: '/calendar' },
              ].map(item => (
                <button key={item.to} onClick={() => { navigate(item.to); setShowUser(false); }}
                  data-testid={`dropdown-${item.to.replace(/^\//, '')}`}
                  className="w-full flex px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >{item.label}</button>
              ))}
              <div className="border-t border-gray-100">
                <button onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left">
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
