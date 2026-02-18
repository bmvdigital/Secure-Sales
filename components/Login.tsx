
import React, { useState } from 'react';
import { 
  Shield, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  Crown, 
  Eye, 
  Zap, 
  Megaphone
} from 'lucide-react';
import { Role, User } from '../types.ts';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
    if (!password) return;
    
    // En una app real aquí se validaría la contraseña contra el perfil seleccionado
    onLogin({ 
      id: `user-${role}-${Date.now()}`, 
      username: roleConfig[role].desc, 
      role 
    });
  };

  const quickAccess = (r: Role) => {
    setPassword('demo123');
    setRole(r);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden border-4 border-white">
        
        {/* Branding - Sidebar en desktop, Header en mobile */}
        <div className="lg:w-5/12 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
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
        <div className="lg:w-7/12 p-8 lg:p-14 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-[900] text-slate-900 tracking-tight">Acceso Operativo</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Seleccione perfil e ingrese contraseña</p>
            </div>

            {/* Selector de Perfil */}
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const Config = roleConfig[r];
                const Icon = Config.icon;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-4 lg:p-5 rounded-3xl border-2 text-left transition-all duration-300 relative ${
                      role === r 
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50' 
                      : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`${Config.bg} ${Config.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={18} />
                    </div>
                    <p className={`font-black text-[11px] uppercase tracking-tighter ${role === r ? 'text-blue-600' : 'text-slate-700'}`}>{Config.desc}</p>
                    {role === r && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-400"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Campo de Contraseña Único */}
            <div className="space-y-4">
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${password ? 'text-blue-600' : 'text-slate-300'}`} size={20} />
                <input 
                  type="password" 
                  placeholder={`Contraseña de ${roleConfig[role].desc}`} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl border border-slate-100 font-bold text-base focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={!password}
              className="w-full py-5 lg:py-6 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-3xl font-black shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase active:scale-[0.98]"
            >
              INGRESAR AL PANEL
              <ChevronRight size={18} />
            </button>

            {/* Quick Access para Demo */}
            <div className="pt-6 border-t border-slate-50">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Accesos Rápidos (Demo)</p>
               <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => quickAccess(Role.OPERATOR)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter transition-colors">Vendedor</button>
                  <button type="button" onClick={() => quickAccess(Role.ADMIN)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter transition-colors">Auditor</button>
                  <button type="button" onClick={() => quickAccess(Role.MASTER)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter transition-colors">Master</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
