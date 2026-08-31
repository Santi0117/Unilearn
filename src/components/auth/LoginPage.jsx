import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Loader2, Zap, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DEMO = [
  { role: 'Administrador', email: 'admin@unilearn.ac.cr', pass: 'admin123', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { role: 'Docente', email: 'alvaro.cordero@unilearn.ac.cr', pass: 'prof123', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { role: 'Estudiante', email: 'estudiante1@unilearn.ac.cr', pass: 'est123', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const res = login(email, password);
    setLoading(false);
    if (res.ok) navigate('/dashboard');
    else setError(res.error);
  };

  const fillDemo = (item) => {
    setEmail(item.email);
    setPassword(item.pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — black hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#0A0A0A' }}>

        {/* Decorative orange glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full float"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full float-delay"
            style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 65%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 60%)' }} />

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

          {/* Orange accent line */}
          <div className="absolute top-0 left-0 w-0.5 h-full"
            style={{ background: 'linear-gradient(to bottom, transparent, #F97316 30%, #EA580C 70%, transparent)' }} />

          {/* Floating dots */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
                background: `rgba(249,115,22,${0.3 + (i % 3) * 0.2})`,
                left: `${15 + (i * 16) % 70}%`,
                top: `${20 + (i * 13) % 60}%`,
                animation: `floatDelay ${4 + i * 0.7}s ease-in-out infinite`
              }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-pulse"
              style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">UniLearn</div>
              <div className="text-xs font-medium" style={{ color: '#FB923C' }}>Plataforma Académica</div>
            </div>
          </div>

          {/* Main copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase border"
              style={{ borderColor: 'rgba(249,115,22,0.4)', color: '#FB923C', background: 'rgba(249,115,22,0.08)' }}>
              <Zap size={11} />
              Plataforma Académica Digital
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              Aprende sin límites,<br/>
              <span style={{ color: '#F97316' }}>crece sin fronteras.</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
              Accede a tus cursos, materiales, calificaciones y comunicación con tus docentes en un solo lugar.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['150+', 'Cursos', BookOpen], ['2,400+', 'Estudiantes', Users], ['98%', 'Satisfacción', Zap]].map(([n, l, Icon]) => (
              <div key={l} className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Icon size={14} className="mx-auto mb-2" style={{ color: '#F97316' }} />
                <div className="text-xl font-bold">{n}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — white form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-white">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">UniLearn</span>
          </div>

          <div className="mb-8">
            <h2 data-testid="login-title" className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="text-gray-500 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Demo pills */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2 font-medium">Acceso demo:</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO.map(d => (
                <button key={d.role} onClick={() => fillDemo(d)}
                  data-testid={`login-demo-${d.role.toLowerCase()}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105 ${d.color}`}>
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} data-testid="login-form" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Correo electrónico</label>
              <input
                data-testid="login-email"
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none text-sm transition-all"
                onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                placeholder="correo@unilearn.ac.cr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  data-testid="login-password"
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none text-sm pr-10 transition-all"
                  onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  data-testid="login-toggle-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div data-testid="login-error" className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} data-testid="login-submit"
              className="w-full py-2.5 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 shimmer-btn"
              style={{ boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            <button className="hover:underline" style={{ color: '#EA580C' }}>¿Olvidaste tu contraseña?</button>
          </p>

          <div className="mt-12 text-center text-xs text-gray-300">
            © 2026 UniLearn — Plataforma Académica Virtual
          </div>
        </div>
      </div>
    </div>
  );
}
