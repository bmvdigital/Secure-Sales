
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
  ArrowUpRight,
  ArrowDownRight,
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

    const categoryVolume = Object.values(Category).map(cat => ({
      name: cat,
      value: data.sales.flatMap(s => s.items).filter(item => data.products.find(p => p.id === item.productId)?.category === cat).reduce((acc, item) => acc + item.quantity, 0)
    })).sort((a, b) => b.value - a.value);

    const topClients = data.customers
      .map(c => ({
        name: c.name,
        total: data.sales.filter(s => s.customerId === c.id).reduce((acc, s) => acc + s.total, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { totalRevenue, netProfit, totalDebt, criticalStock, dayTrend, zoneData, categoryVolume, topClients, goalPercentage };
  }, [data]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">VISTA GENERAL</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Resumen de operaciones Feria Tabasco 2026</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-black text-blue-700 uppercase">Feria Live Pulse</span>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] cyber-shadow overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 text-blue-50/20 group-hover:text-blue-50/40 transition-colors">
          <Target size={120} strokeWidth={4} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-1">Meta Institucional Feria 2026</p>
              <h3 className="text-3xl font-[900] text-slate-900">Progreso de Ventas</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-blue-600 mb-1">{stats.goalPercentage.toFixed(1)}% COMPLETADO</p>
              <p className="text-xs font-bold text-slate-400">${stats.totalRevenue.toLocaleString()} / $12,000,000</p>
            </div>
          </div>
          <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
             <div 
               className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
               style={{ width: `${stats.goalPercentage}%` }}
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Ingresos Totales" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+22.4%" positive={true} color="blue" />
        <KpiCard title="Utilidad Neta (Est.)" value={`$${stats.netProfit.toLocaleString()}`} icon={TrendingUp} trend="+14.2%" positive={true} color="cyan" />
        <KpiCard title="Cartera Activa" value={`$${stats.totalDebt.toLocaleString()}`} icon={Wallet} trend="+3.1%" positive={false} color="indigo" />
        <KpiCard title="Stock Crítico" value={stats.criticalStock} icon={AlertTriangle} trend={stats.criticalStock > 10 ? 'High Risk' : 'Healthy'} positive={stats.criticalStock < 10} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ChartContainer title="Comportamiento Diario (Últimos 5 Días)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.dayTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="sales" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Ventas por Zona (Impacto Feria)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.zoneData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                {stats.zoneData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Volumen Logístico por Categoría">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={stats.categoryVolume} margin={{left: 60}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 10, 10, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Top 5 Clientes de Mayor Volumen">
          <div className="space-y-6">
            {stats.topClients.map((client, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400">{idx + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{client.name}</p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: `${(client.total / (stats.topClients[0]?.total || 1)) * 100}%`}} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">${client.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, trend, positive, color }: any) => {
  const colorMap: any = { blue: 'bg-blue-600', cyan: 'bg-cyan-500', indigo: 'bg-indigo-600', amber: 'bg-amber-500' };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] cyber-shadow group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-3xl ${colorMap[color]} text-white shadow-lg`}><Icon size={24} /></div>
        <div className={`flex items-center gap-1 text-xs font-black uppercase ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-[900] text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] cyber-shadow">
    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">{title}</h4>
    {children}
  </div>
);

export default Dashboard;
