
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
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl lg:text-4xl font-[900] text-slate-900 tracking-tight leading-none uppercase">Visión General</h2>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
           <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">En vivo • Feria 2026</p>
        </div>
      </div>

      <div className="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] cyber-shadow overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 lg:p-8 text-blue-50/20 group-hover:text-blue-50/40 transition-colors hidden md:block">
          <Target size={100} strokeWidth={4} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
            <div>
              <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Métricas de Rendimiento</p>
              <h3 className="text-xl lg:text-2xl font-[900] text-slate-900 leading-tight">Progreso Institucional</h3>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-black text-blue-600 mb-1">{stats.goalPercentage.toFixed(1)}% DE LA META</p>
              <p className="text-[10px] font-bold text-slate-400">${stats.totalRevenue.toLocaleString()} / $12M</p>
            </div>
          </div>
          <div className="w-full h-4 lg:h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
             <div 
               className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
               style={{ width: `${stats.goalPercentage}%` }}
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KpiCard title="Ingresos" value={`$${(stats.totalRevenue/1000).toFixed(0)}k`} icon={DollarSign} trend="+22%" positive={true} color="blue" />
        <KpiCard title="Utilidad" value={`$${(stats.netProfit/1000).toFixed(0)}k`} icon={TrendingUp} trend="+14%" positive={true} color="cyan" />
        <KpiCard title="Deuda" value={`$${(stats.totalDebt/1000).toFixed(0)}k`} icon={Wallet} trend="+3%" positive={false} color="indigo" />
        <KpiCard title="Stock" value={stats.criticalStock} icon={AlertTriangle} trend="Critical" positive={stats.criticalStock < 10} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <ChartContainer title="Ventas Diarias">
          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dayTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Zonas de Impacto">
          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.zoneData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                  {stats.zoneData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Top Clientes">
          <div className="space-y-5">
            {stats.topClients.map((client, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-700 truncate">{client.name}</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: `${(client.total / (stats.topClients[0]?.total || 1)) * 100}%`}} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-slate-900">${(client.total/1000).toFixed(1)}k</p>
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
    <div className="bg-white p-4 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] cyber-shadow border border-transparent hover:border-blue-50 active:scale-95 transition-all">
      <div className="flex justify-between items-start mb-4 lg:mb-6">
        <div className={`p-2.5 lg:p-4 rounded-xl lg:rounded-3xl ${colorMap[color]} text-white shadow-lg`}><Icon size={16} /></div>
        <div className={`hidden sm:flex items-center gap-1 text-[9px] font-black uppercase ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 font-bold text-[9px] lg:text-xs uppercase tracking-widest mb-1 truncate">{title}</p>
        <h3 className="text-lg lg:text-3xl font-[900] text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] cyber-shadow border border-slate-50">
    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 lg:mb-8">{title}</h4>
    {children}
  </div>
);

export default Dashboard;
