
import React, { useState, useMemo } from 'react';
import { Package, Search, AlertTriangle, Plus, Minus, Filter, History } from 'lucide-react';
import { AppData, User, Role, Category } from '../types.ts';

interface InventoryProps {
  data: AppData;
  user: User;
  onAdjust: (productId: string, warehouseId: string, quantity: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ data, user, onAdjust }) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(data.warehouses[0].id);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return data.inventory
      .filter(i => i.warehouseId === selectedWarehouseId)
      .map(item => ({
        ...item,
        product: data.products.find(p => p.id === item.productId)!
      }))
      .filter(i => i.product.name.toLowerCase().includes(search.toLowerCase()))
      .filter(i => selectedCategory === 'All' || i.product.category === selectedCategory);
  }, [data, selectedWarehouseId, search, selectedCategory]);

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-[900] text-slate-900 tracking-tight uppercase leading-none">Inventario</h2>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Suministros Feria 2026</p>
        </div>
        <div className="w-full">
           <select 
              value={selectedWarehouseId} 
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="w-full bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm font-bold text-xs focus:outline-none"
            >
              {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Filtrar stock..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-12 pr-4 py-4 rounded-xl border border-slate-100 shadow-sm font-bold text-xs"
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm font-bold text-xs"
        >
          <option value="All">Categorías</option>
          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] cyber-shadow overflow-hidden border border-slate-50">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Producto</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Valor</th>
                {user.role === Role.MASTER && <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Ajuste</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(item => (
                <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Package size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate">{item.product.name}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase">{item.product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${item.quantity < 50 ? 'text-rose-500' : 'text-slate-800'}`}>
                        {item.quantity}
                      </span>
                      {item.quantity < 50 && <AlertTriangle size={12} className="text-rose-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      ${(item.quantity * item.product.acquisitionCost).toLocaleString()}
                    </span>
                  </td>
                  {user.role === Role.MASTER && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onAdjust(item.productId, selectedWarehouseId, -10)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <button 
                          onClick={() => onAdjust(item.productId, selectedWarehouseId, 10)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-500 rounded transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
