import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DEMO = [
  { role: 'Administrador', email: 'admin@unilearn.ac.cr', pass: 'admin123', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { role: 'Docente', email: 'alvaro.cordero@unilearn.ac.cr', pass: 'prof123', color: 'bg-blue-100 text-blue-700 border-blue-200' },
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
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1e4080 50%, #2563EB 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px`, left: `${(i * 17) % 80}%`, top: `${(i * 23) % 80}%`, opacity: 0.3 - i * 0.01 }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">UniLearn</div>
              <div className="text-blue-200 text-sm">Plataforma Académica</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Aprende sin límites,<br/>crece sin fronteras.</h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-12">
            Accede a tus cursos, materiales, calificaciones y comunicación con tus docentes en un solo lugar.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[['150+', 'Cursos'], ['2,400+', 'Estudiantes'], ['98%', 'Satisfacción']].map(([n, l]) => (
              <div key={l} className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-2xl font-bold">{n}</div>
                <div className="text-blue-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-white">
        <div className="max-w-sm w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">UniLearn</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Demo pills */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2 font-medium">Acceso demo:</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO.map(d => (
                <button key={d.role} onClick={() => fillDemo(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105 ${d.color}`}>
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Correo electrónico</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder="correo@unilearn.ac.cr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            <button className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</button>
          </p>

          <div className="mt-12 text-center text-xs text-gray-300">
            © 2026 UniLearn — Plataforma Académica Virtual
          </div>
        </div>
      </div>
    </div>
  );
}
