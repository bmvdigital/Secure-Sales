
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
import { Role, User } from '../types.ts';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.MASTER);

  const roleConfig = {
    [Role.MASTER]: { icon: Crown, desc: 'Master', color: 'text-amber-500', bg: 'bg-amber-50' },
    [Role.ADMIN]: { icon: Eye, desc: 'Auditor', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    [Role.OPERATOR]: { icon: Zap, desc: 'Ventas', color: 'text-blue-500', bg: 'bg-blue-50' },
    [Role.PROMOTOR]: { icon: Megaphone, desc: 'Preventa', color: 'text-rose-500', bg: 'bg-rose-50' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    onLogin({ id: `user-${Date.now()}`, username, role });
  };

  const quickAccess = (u: string, r: Role) => {
    setUsername(u);
    setPassword('demo123');
    setRole(r);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden border-4 border-white">
        
        {/* Branding - Sidebar en desktop, Header en mobile */}
        <div className="lg:w-5/12 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
              <TrendingUp size={28} />
            </div>
            <h1 className="text-3xl lg:text-5xl font-[900] tracking-tighter leading-none mb-2">SECURE<br/>SALES</h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">FERIA 2026 EDITION</p>
          </div>

          <div className="relative z-10 hidden lg:block space-y-6">
            <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/5 p-4 rounded-2xl border border-emerald-400/20">
              <Shield size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Core</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:w-7/12 p-8 lg:p-14">
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-3xl font-[900] text-slate-900 tracking-tight">Acceso Operativo</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Seleccione perfil</p>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const Config = roleConfig[r];
                const Icon = Config.icon;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-3 lg:p-4 rounded-2xl border-2 text-left transition-all duration-300 relative ${
                      role === r 
                      ? 'border-blue-600 bg-blue-50/50 shadow-md' 
                      : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`${Config.bg} ${Config.color} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                      <Icon size={14} />
                    </div>
                    <p className={`font-black text-[10px] uppercase tracking-tighter ${role === r ? 'text-blue-600' : 'text-slate-700'}`}>{Config.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ID de Usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 pl-12 pr-4 py-4 rounded-xl border border-slate-100 font-bold text-sm focus:bg-white transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 pl-12 pr-4 py-4 rounded-xl border border-slate-100 font-bold text-sm focus:bg-white transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 lg:py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-3 text-xs tracking-widest uppercase"
            >
              INGRESAR AL PANEL
              <ChevronRight size={16} />
            </button>

            <div className="pt-4 border-t border-slate-50">
               <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => quickAccess('Vendedor', Role.OPERATOR)} className="px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">Venta Rápida</button>
                  <button type="button" onClick={() => quickAccess('Auditor', Role.ADMIN)} className="px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">Modo Auditor</button>
                  <button type="button" onClick={() => quickAccess('Master', Role.MASTER)} className="px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">Master</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
