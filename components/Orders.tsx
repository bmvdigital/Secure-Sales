
import React from 'react';
import { ClipboardList, Plus, Package, User, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { AppData, User as UserType, Role, OrderStatus } from '../types';

interface OrdersProps {
  data: AppData;
  user: UserType;
  onAddOrder: (order: any) => void;
  onProcess: (orderId: string, status: OrderStatus) => void;
}

const Orders: React.FC<OrdersProps> = ({ data, user, onAddOrder, onProcess }) => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">PRE-VENTA / PEDIDOS</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Levantamiento de Pedidos Móviles</p>
        </div>
        {(user.role === Role.PROMOTOR || user.role === Role.MASTER || user.role === Role.OPERATOR) && (
          <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-blue-100 hover:scale-105 transition-all">
            <Plus size={20} /> LEVANTAR PEDIDO
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.orders.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300">
            <ClipboardList size={64} strokeWidth={1} />
            <p className="font-bold mt-4">No hay pedidos pendientes en el sistema</p>
          </div>
        ) : (
          data.orders.map(order => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] cyber-shadow space-y-6">
               <div className="flex justify-between items-start">
                 <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                   order.status === OrderStatus.PENDIENTE ? 'bg-amber-50 text-amber-600' :
                   order.status === OrderStatus.COMPLETADO ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                 }`}>
                   {order.status}
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(order.date).toLocaleDateString()}</span>
               </div>

               <div>
                 <h4 className="text-xl font-[900] text-slate-800">{data.customers.find(c => c.id === order.customerId)?.name}</h4>
                 <div className="flex items-center gap-2 mt-1">
                   <Clock size={12} className="text-slate-400" />
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promotor: {order.promoterId}</span>
                 </div>
               </div>

               <div className="space-y-3 py-4 border-y border-slate-50">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm">
                     <span className="font-bold text-slate-600">{item.quantity}x {data.products.find(p => p.id === item.productId)?.name}</span>
                     <span className="font-mono text-slate-400">${(item.quantity * item.price).toLocaleString()}</span>
                   </div>
                 ))}
               </div>

               <div className="flex justify-between items-center">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Estimado</span>
                 <span className="text-2xl font-[900] text-slate-900">${order.total.toLocaleString()}</span>
               </div>

               {order.status === OrderStatus.PENDIENTE && (user.role === Role.OPERATOR || user.role === Role.MASTER) && (
                 <div className="flex gap-4 pt-4">
                   <button 
                     onClick={() => onProcess(order.id, OrderStatus.CANCELADO)}
                     className="flex-1 py-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                   >
                     <XCircle size={18} /> Cancelar
                   </button>
                   <button 
                     onClick={() => onProcess(order.id, OrderStatus.COMPLETADO)}
                     className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                   >
                     <CheckCircle2 size={18} /> Facturar
                   </button>
                 </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
