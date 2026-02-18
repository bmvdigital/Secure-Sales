
import React, { useState } from 'react';
import { 
  Shield, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  User as UserIcon, 
  Crown, 
  Eye, 
  Zap, 
  Megaphone,
  Info
} from 'lucide-react';
import { Role, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.MASTER);

  const roleConfig = {
    [Role.MASTER]: { icon: Crown, desc: 'Control total y ajustes', color: 'text-amber-500', bg: 'bg-amber-50' },
    [Role.ADMIN]: { icon: Eye, desc: 'Auditoría (Solo Lectura)', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    [Role.OPERATOR]: { icon: Zap, desc: 'Ventas y almacén', color: 'text-blue-500', bg: 'bg-blue-50' },
    [Role.PROMOTOR]: { icon: Megaphone, desc: 'Preventa y clientes', color: 'text-rose-500', bg: 'bg-rose-50' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert('Ingrese un nombre de usuario');
    if (!password) return alert('Ingrese su contraseña');
    
    // Simulación de acceso
    onLogin({ id: `user-${Date.now()}`, username, role });
  };

  const quickAccess = (u: string, r: Role) => {
    setUsername(u);
    setPassword('demo123');
    setRole(r);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white">
        
        {/* Lado Izquierdo - Branding */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
              <TrendingUp size={32} />
            </div>
            <h1 className="text-5xl font-[900] tracking-tighter leading-none mb-4">SECURE<br/>SALES</h1>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Core Platform 2026</p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-2xl border border-emerald-400/20">
              <Shield size={20} />
              <span className="text-sm font-black uppercase tracking-widest">Servidor Encriptado</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Plataforma autorizada para el control operativo de la Feria Tabasco 2026. Todos los movimientos son auditados.
            </p>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="md:w-7/12 p-12 lg:p-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-[900] text-slate-900">Bienvenido de nuevo</h2>
              <p className="text-slate-400 font-semibold">Seleccione su perfil de acceso para continuar.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const Config = roleConfig[r];
                const Icon = Config.icon;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 relative group ${
                      role === r 
                      ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' 
                      : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`${Config.bg} ${Config.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon size={20} />
                    </div>
                    <p className={`font-black text-sm mb-1 ${role === r ? 'text-blue-600' : 'text-slate-700'}`}>{r}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{Config.desc}</p>
                    {role === r && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-400"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl border border-slate-100 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:bg-white transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl border border-slate-100 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-3xl font-black shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group"
            >
              INICIAR SESIÓN
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Credenciales rápidas para demo */}
            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                 <Info size={14} className="text-blue-500" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acceso Rápido (Demo)</p>
               </div>
               <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => quickAccess('MasterControl', Role.MASTER)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 transition-colors border border-slate-100">MASTER</button>
                  <button type="button" onClick={() => quickAccess('AuditorFeria', Role.ADMIN)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 transition-colors border border-slate-100">ADMIN (Lectura)</button>
                  <button type="button" onClick={() => quickAccess('Vendedor01', Role.OPERATOR)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 transition-colors border border-slate-100">OPERADOR</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
