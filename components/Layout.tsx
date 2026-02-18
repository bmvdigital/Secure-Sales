
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  ClipboardList, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react';
import { Role, User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  setView: (v: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, currentView, setView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'sales', label: 'Terminal Ventas', icon: ShoppingCart, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'orders', label: 'Pedidos / Preventa', icon: ClipboardList, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'inventory', label: 'Inventario', icon: Package, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'logistics', label: 'Logística', icon: Truck, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'audit', label: 'Auditoría', icon: History, roles: [Role.MASTER, Role.ADMIN] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col z-20 ${sidebarOpen ? 'w-80' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
            <TrendingUp size={24} />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-black text-slate-900 leading-none">SECURE SALES</h1>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">2026 Edition</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide mt-4">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-200 group active:scale-[0.98] ${
                currentView === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={22} className={currentView === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
          <div className={`flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
               <ShieldCheck size={20} className="text-slate-600" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.username}</p>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{user.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className={`w-full mt-4 flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-red-500 rounded-[1.5rem] transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-semibold text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estado Sistema</p>
              <p className="text-sm font-black text-emerald-500">ONLINE • MODO PRODUCCIÓN</p>
            </div>
            <div className="w-px h-10 bg-slate-100 hidden md:block" />
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
