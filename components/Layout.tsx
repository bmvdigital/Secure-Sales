
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
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
    <div className="flex h-screen bg-gray-50 overflow-hidden relative font-sans text-slate-900">
      {/* Mobile Backdrop - Solo visible cuando el sidebar está abierto en móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Diseño mejorado para no sobreponerse */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out flex flex-col
        ${isMobile ? (sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]') : (sidebarOpen ? 'w-64' : 'w-20')}
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-5 border-b border-slate-50 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
            <TrendingUp size={18} />
          </div>
          {(sidebarOpen || isMobile) && (
            <div className="ml-3 overflow-hidden">
              <h1 className="text-sm font-black text-slate-900 leading-none uppercase tracking-tight">Secure Sales</h1>
              <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Feria Tabasco</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {(sidebarOpen || isMobile) && (
                <span className="font-bold text-xs uppercase tracking-wider truncate">{item.label}</span>
              )}
              {currentView === item.id && !sidebarOpen && !isMobile && (
                <div className="absolute right-0 w-1 h-5 bg-white rounded-l-full" />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 ${(!sidebarOpen && !isMobile) && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
               <ShieldCheck size={14} className="text-slate-500" />
            </div>
            {(sidebarOpen || isMobile) && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate uppercase text-slate-700">{user.username}</p>
                <p className="text-[8px] uppercase font-bold text-slate-400 tracking-tighter">{user.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className={`w-full mt-3 flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all ${(!sidebarOpen && !isMobile) && 'justify-center'}`}
          >
            <LogOut size={16} />
            {(sidebarOpen || isMobile) && <span className="font-bold text-[10px] uppercase tracking-widest">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Header */}
        <header className="h-14 lg:h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 -ml-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
              aria-label="Toggle Menu"
            >
              {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
              Panel Operativo
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <p className="text-[10px] lg:text-xs font-black text-slate-600 uppercase tracking-tighter">
                  {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}
                </p>
             </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
