
import React, { useState } from 'react';
import { Truck, ArrowRight, Package, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { AppData, User, Role, TransferStatus } from '../types';

interface LogisticsProps {
  data: AppData;
  user: User;
  onTransfer: (transfer: any) => void;
  onReceive: (transferId: string) => void;
}

const Logistics: React.FC<LogisticsProps> = ({ data, user, onTransfer, onReceive }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Minimal transfer form state for MVP
  const [origin, setOrigin] = useState(data.warehouses[0].id);
  const [dest, setDest] = useState(data.warehouses[1].id);
  const [prod, setProd] = useState(data.products[0].id);
  const [qty, setQty] = useState('100');

  const handleTransfer = () => {
    if (origin === dest) {
      alert('Almacenes deben ser distintos');
      return;
    }
    
    const newTransfer = {
      id: `TRF-${Date.now()}`,
      date: new Date().toISOString(),
      originWarehouseId: origin,
      destinationWarehouseId: dest,
      productId: prod,
      quantity: parseInt(qty),
      status: TransferStatus.EN_CAMINO
    };

    onTransfer(newTransfer);
    setShowModal(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">LOGÍSTICA Y RUTAS</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Traspasos entre Almacenes</p>
        </div>
        {(user.role === Role.MASTER || user.role === Role.OPERATOR) && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
          >
            <Truck size={20} /> NUEVO TRASPASO
          </button>
        )}
      </div>

      <div className="space-y-6">
        {data.transfers.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-300">
            <Truck size={64} strokeWidth={1} />
            <p className="font-bold mt-4 text-center">Sin movimientos de mercancía<br/>registrados actualmente.</p>
          </div>
        ) : (
          data.transfers.map(trf => (
            <div key={trf.id} className="bg-white p-8 rounded-[2.5rem] cyber-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  trf.status === TransferStatus.EN_CAMINO ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                }`}>
                  <Truck size={32} />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Origen</p>
                    <span className="px-4 py-2 bg-slate-50 rounded-xl font-bold text-slate-700 block">
                      {data.warehouses.find(w => w.id === trf.originWarehouseId)?.name}
                    </span>
                  </div>
                  <ArrowRight className="text-slate-200" />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Destino</p>
                    <span className="px-4 py-2 bg-slate-50 rounded-xl font-bold text-slate-700 block">
                      {data.warehouses.find(w => w.id === trf.destinationWarehouseId)?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:px-10 py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-100">
                <div className="flex items-center gap-4">
                  <Package className="text-indigo-400" />
                  <div>
                    <h4 className="text-lg font-black text-slate-800">
                      {trf.quantity}x {data.products.find(p => p.id === trf.productId)?.name}
                    </h4>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Movimiento: {trf.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Estado</p>
                   <span className={`font-black text-sm uppercase ${
                     trf.status === TransferStatus.EN_CAMINO ? 'text-amber-500' : 'text-emerald-500'
                   }`}>{trf.status}</span>
                </div>
                
                {trf.status === TransferStatus.EN_CAMINO && (user.role === Role.MASTER || user.role === Role.OPERATOR) && (
                  <button 
                    onClick={() => onReceive(trf.id)}
                    className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-100 transition-all flex items-center gap-2"
                  >
                    RECIBIR <CheckCircle size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-[900] text-slate-900">Configurar Traspaso</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-all">
                  <ChevronRight className="rotate-90" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bodega Origen</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold focus:outline-none">
                    {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bodega Destino</label>
                  <select value={dest} onChange={(e) => setDest(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold focus:outline-none">
                    {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</label>
                  <select value={prod} onChange={(e) => setProd(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold focus:outline-none">
                    {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cantidad</label>
                  <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold focus:outline-none" />
                </div>
              </div>

              <button 
                onClick={handleTransfer}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-4 mt-4"
              >
                AUTORIZAR ENVÍO
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
