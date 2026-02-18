
import React from 'react';
import { History, ShieldCheck, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { AppData } from '../types';

const AuditLog: React.FC<{ data: AppData }> = ({ data }) => {
  const events = [
    ...data.sales.map(s => ({ ...s, type: 'VENTA', icon: ShoppingBag, color: 'blue' })),
    ...data.transfers.map(t => ({ ...t, type: 'TRASPASO', icon: Truck, color: 'indigo' })),
    ...data.orders.map(o => ({ ...o, type: 'PEDIDO', icon: History, color: 'cyan' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">BITÁCORA AUDITORÍA</h2>
        <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Historial completo de movimientos</p>
      </div>

      <div className="bg-white rounded-[2.5rem] cyber-shadow overflow-hidden p-8">
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-20 text-slate-300 font-bold">Sin eventos registrados</div>
          ) : (
            events.map((event, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400`}>
                    <event.icon size={22} />
                  </div>
                  {idx < events.length - 1 && <div className="w-px h-full min-h-[1.5rem] bg-slate-100 mt-2" />}
                </div>
                <div className="flex-1 bg-slate-50 p-6 rounded-[1.5rem]">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(event.date).toLocaleString()}</span>
                     <span className="px-3 py-1 bg-white text-[10px] font-black rounded-lg uppercase tracking-tighter text-slate-600 border border-slate-100">{event.type}</span>
                   </div>
                   <p className="text-sm font-bold text-slate-800">
                     Movimiento ID: <span className="text-blue-600">#{event.id}</span>
                   </p>
                   <p className="text-xs text-slate-400 font-bold mt-1">Total Impacto: ${event.total?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
