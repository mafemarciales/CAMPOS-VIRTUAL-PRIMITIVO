import React, { useState } from 'react';
import { User, UserRole, SchoolConfig } from '../types';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2,
  GraduationCap, UserCheck, ShieldAlert, Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  allUsers: User[];
  config: SchoolConfig;
  onLoginSuccess: (user: User) => void;
  onOpenRecovery: () => void;
}

const DEMO_ROLES: { role: UserRole; title: string; email: string; icon: React.FC<{ className?: string }> }[] = [
  { role: 'student', title: 'Estudiante', email: 'estudiante@ieprimitivoleal.edu.co', icon: GraduationCap },
  { role: 'teacher', title: 'Docente', email: 'docente@ieprimitivoleal.edu.co', icon: UserCheck },
  { role: 'parent', title: 'Padre / Acudiente', email: 'padre@ieprimitivoleal.edu.co', icon: Award },
  { role: 'admin', title: 'Administrador', email: 'admin@ieprimitivoleal.edu.co', icon: ShieldAlert },
  { role: 'rector', title: 'Rectoría', email: 'rector@ieprimitivoleal.edu.co', icon: ShieldCheck },
  { role: 'coordinator', title: 'Coordinación', email: 'coordinador@ieprimitivoleal.edu.co', icon: Sparkles }
];

export const LoginView: React.FC<LoginViewProps> = ({
  allUsers,
  config,
  onLoginSuccess,
  onOpenRecovery
}) => {
  const [email, setEmail] = useState('estudiante@ieprimitivoleal.edu.co');
  const [password, setPassword] = useState('123456');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!foundUser) {
      setError('Credenciales incorrectas. Verifique el correo institucional ingresado.');
      return;
    }
    setError('');
    onLoginSuccess(foundUser);
  };

  const handleSelectDemoRole = (userEmail: string) => {
    const foundUser = allUsers.find(u => u.email === userEmail);
    if (foundUser) {
      setEmail(foundUser.email);
      setPassword('123456');
      onLoginSuccess(foundUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        >
          {/* Left Column: Branding Hero */}
          <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={config.logoUrl}
                  alt={config.institutionName}
                  className="w-12 h-12 object-cover rounded-2xl border border-white/20 shadow-md"
                />
                <div>
                  <h1 className="text-base font-black tracking-tight text-white uppercase">
                    {config.institutionName}
                  </h1>
                  <p className="text-xs text-blue-200">{config.slogan}</p>
                </div>
              </div>

              <div className="my-8 space-y-4">
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Plataforma Digital Educativa
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                  Bienvenido al Campus Virtual Institucional
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Accede a tus calificaciones, eventos, citaciones, solicitud de certificados en línea, comunicados y biblioteca digital desde un solo lugar.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autenticación segura para 6 roles institucionales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seguimiento académico y administrativo en tiempo real</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form & Quick Demo Roles */}
          <div className="p-8 sm:p-10 flex flex-col justify-between bg-slate-900">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Iniciar Sesión</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresa tu correo institucional y contraseña de acceso
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-xs text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@ieprimitivoleal.edu.co"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Recordar sesión</span>
                  </label>
                  <button
                    type="button"
                    onClick={onOpenRecovery}
                    className="text-blue-400 hover:underline transition-all"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Ingresar al Campus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Account Quick Buttons */}
              <div className="mt-8 border-t border-slate-800 pt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Acceso Rápido de Prueba (Evaluación de Roles)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleSelectDemoRole(r.email)}
                        className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all hover:border-blue-500/50 group flex items-center gap-2"
                      >
                        <Icon className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">{r.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright */}
      <div className="p-4 text-center text-xs text-slate-500 z-10">
        © {new Date().getFullYear()} {config.institutionName} — Todos los derechos reservados.
      </div>
    </div>
  );
};
