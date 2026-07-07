import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, generateNotifications } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('unilearn_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Credenciales incorrectas' };
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem('unilearn_user', JSON.stringify(safe));
    return { ok: true, user: safe };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unilearn_user');
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('unilearn_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
