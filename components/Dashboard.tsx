
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
  Target
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

    const topClients = data.customers
      .map(c => ({
        name: c.tradeName,
        total: data.sales.filter(s => s.customerId === c.id).reduce((acc, s) => acc + s.total, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { totalRevenue, netProfit, totalDebt, criticalStock, dayTrend, zoneData, topClients, goalPercentage };
  }, [data]);

  return (
    <div className="space-y-4 lg:space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Dashboard</h2>
        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Estado Operativo Feria 2026</p>
      </div>

      <div className="bg-white p-4 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-blue-50/10 hidden md:block"><Target size={80}/></div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Meta de Ventas</h3>
            <span className="text-[10px] font-black text-blue-600">{stats.goalPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-50 rounded-full border border-slate-100 p-0.5">
             <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${stats.goalPercentage}%` }} />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase text-center">${stats.totalRevenue.toLocaleString()} / $12M</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <KpiCard title="Ingresos" value={`$${(stats.totalRevenue/1000).toFixed(0)}k`} icon={DollarSign} color="blue" />
        <KpiCard title="Utilidad" value={`$${(stats.netProfit/1000).toFixed(0)}k`} icon={TrendingUp} color="cyan" />
        <KpiCard title="Deuda" value={`$${(stats.totalDebt/1000).toFixed(0)}k`} icon={Wallet} color="indigo" />
        <KpiCard title="Stock" value={stats.criticalStock} icon={AlertTriangle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-20 lg:pb-0">
        <ChartContainer title="Tendencia">
          <div className="h-[200px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dayTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '0.75rem', border: 'none', fontSize: '10px'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Zonas">
          <div className="h-[200px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.zoneData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                  {stats.zoneData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '9px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: any = { blue: 'bg-blue-600', cyan: 'bg-cyan-500', indigo: 'bg-indigo-600', amber: 'bg-amber-500' };
  return (
    <div className="bg-white p-3 lg:p-8 rounded-[1.25rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-95 transition-all">
      <div className={`p-2 lg:p-4 rounded-lg lg:rounded-3xl ${colorMap[color]} text-white shadow-md inline-block mb-3`}>
        <Icon size={14} />
      </div>
      <div>
        <p className="text-slate-400 font-bold text-[8px] lg:text-xs uppercase tracking-widest mb-0.5 truncate">{title}</p>
        <h3 className="text-sm lg:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white p-4 lg:p-8 rounded-[1.5rem] border border-slate-100">
    <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-4">{title}</h4>
    {children}
  </div>
);

export default Dashboard;
