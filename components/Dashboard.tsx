
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Wallet,
  Target,
  Package,
  Users
} from 'lucide-react';
import { AppData, Category } from '../types.ts';

interface DashboardProps {
  data: AppData;
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#6366f1'];
const SALES_GOAL = 12000000;

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalRevenue = data.sales.reduce((acc, s) => acc + s.total, 0);
    const netProfit = totalRevenue * 0.13; 
    const totalDebt = data.customers.reduce((acc, c) => acc + c.balance, 0);
    const criticalStock = data.inventory.filter(i => i.quantity < 500).length;
    const goalPercentage = Math.min((totalRevenue / SALES_GOAL) * 100, 100);

    const dayTrend = Array.from({ length: 5 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (4 - i));
      const dateStr = date.toISOString().split('T')[0];
      const daySales = data.sales
        .filter(s => s.date.split('T')[0] === dateStr)
        .reduce((acc, s) => acc + s.total, 0);
      return { name: date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }), sales: daySales };
    });

    const uniqueZones = Array.from(new Set(data.customers.map(c => c.zone)));
    const zoneData = uniqueZones.map(zone => ({
      name: zone,
      value: data.sales
        .filter(s => data.customers.find(c => c.id === s.customerId)?.zone === zone)
        .reduce((acc, s) => acc + s.total, 0)
    })).filter(z => z.value > 0);

    // Top 5 Clientes por Volumen de Compra ($)
    const topClients = data.customers
      .map(c => ({
        name: c.tradeName,
        total: data.sales.filter(s => s.customerId === c.id).reduce((acc, s) => acc + s.total, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Top 5 Productos por Unidades Vendidas
    const productSalesMap: Record<string, number> = {};
    data.sales.forEach(sale => {
      sale.items.forEach(item => {
        productSalesMap[item.productId] = (productSalesMap[item.productId] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([id, qty]) => ({
        name: data.products.find(p => p.id === id)?.name || 'Desconocido',
        quantity: qty
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { totalRevenue, netProfit, totalDebt, criticalStock, dayTrend, zoneData, topClients, topProducts, goalPercentage };
  }, [data]);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
      {/* Page Title & Context */}
      <div className="flex flex-col gap-1.5 px-1 lg:px-0">
        <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
          Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-slate-400 font-bold uppercase text-[8px] lg:text-[10px] tracking-[0.15em]">
            Estado Operativo en Tiempo Real
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-5 lg:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 text-blue-50/20 hidden md:block">
          <Target size={60}/>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta de Ventas en Feria Tabasco 2026</span>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{stats.goalPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-50 rounded-full border border-slate-100">
             <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-sm" 
                style={{ width: `${stats.goalPercentage}%` }} 
             />
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
             <span>$0</span>
             <span className="text-slate-900 font-black">${stats.totalRevenue.toLocaleString()}</span>
             <span>$12M</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <KpiCard title="Ingresos" value={`$${(stats.totalRevenue/1000).toFixed(0)}k`} icon={DollarSign} color="blue" />
        <KpiCard title="Utilidad" value={`$${(stats.netProfit/1000).toFixed(0)}k`} icon={TrendingUp} color="cyan" />
        <KpiCard title="Deuda" value={`$${(stats.totalDebt/1000).toFixed(0)}k`} icon={Wallet} color="indigo" />
        <KpiCard title="Stock" value={stats.criticalStock} icon={AlertTriangle} color="amber" />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Tendencia de Ventas (5 días)">
          <div className="h-[220px] lg:h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dayTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '0.75rem', border: 'none', fontSize: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Distribución por Zonas">
          <div className="h-[220px] lg:h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.zoneData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {stats.zoneData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '9px', fontWeight: 700, paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Top 5 Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 lg:pb-0">
        <ChartContainer title="Top 5 Clientes (Ventas $)">
          <div className="space-y-4 mt-4">
            {stats.topClients.map((client, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Users size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">{client.name}</p>
                    <p className="text-[10px] font-black text-slate-900">${(client.total / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(client.total / (stats.topClients[0]?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Top 5 Productos (Unidades)">
          <div className="space-y-4 mt-4">
            {stats.topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Package size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">{prod.name}</p>
                    <p className="text-[10px] font-black text-slate-900">{prod.quantity} u.</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(prod.quantity / (stats.topProducts[0]?.quantity || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: any = { blue: 'bg-blue-600', cyan: 'bg-cyan-500', indigo: 'bg-indigo-600', amber: 'bg-amber-500' };
  return (
    <div className="bg-white p-4 lg:p-7 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm active:scale-95 transition-all">
      <div className={`w-8 h-8 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl ${colorMap[color]} text-white shadow-md flex items-center justify-center mb-3 lg:mb-4`}>
        <Icon size={16} className="lg:scale-125" />
      </div>
      <div>
        <p className="text-slate-400 font-bold text-[8px] lg:text-xs uppercase tracking-widest mb-0.5 truncate">{title}</p>
        <h3 className="text-base lg:text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</h3>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white p-5 lg:p-8 rounded-3xl border border-slate-100 shadow-sm">
    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-l-2 border-blue-600 pl-3">
      {title}
    </h4>
    {children}
  </div>
);

export default Dashboard;
