
import React, { useState, useEffect } from 'react';
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
import { Role, User } from '../types.ts';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  setView: (v: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, currentView, setView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'inventory', label: 'Inventario', icon: Package, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR, Role.PROMOTOR] },
    { id: 'logistics', label: 'Logística', icon: Truck, roles: [Role.MASTER, Role.ADMIN, Role.OPERATOR] },
    { id: 'audit', label: 'Auditoría', icon: History, roles: [Role.MASTER, Role.ADMIN] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  const handleNavClick = (id: string) => {
    setView(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
        ${!sidebarOpen && 'lg:overflow-hidden'}
      `}>
        <div className="p-5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
            <TrendingUp size={20} />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-base font-black text-slate-900 leading-none uppercase">Secure Sales</h1>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">2026</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide mt-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group active:scale-[0.98] ${
                currentView === item.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={18} className={currentView === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              {sidebarOpen && <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
               <ShieldCheck size={16} className="text-slate-600" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate uppercase text-slate-800">{user.username}</p>
                <p className="text-[8px] uppercase font-black text-slate-400 tracking-tighter">{user.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className={`w-full mt-2 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span className="font-bold text-[10px] uppercase tracking-widest">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 lg:h-16 bg-white border-b border-slate-100 flex items-center justify-between px-3 lg:px-8 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
          >
            {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] lg:text-xs font-black text-slate-900 leading-none">
                {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
