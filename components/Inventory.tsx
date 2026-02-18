
import React, { useState, useMemo } from 'react';
import { Package, Search, AlertTriangle, Plus, Minus, Filter, History } from 'lucide-react';
import { AppData, User, Role, Category } from '../types';

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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">INVENTARIO CENTRAL</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Control de Stock y Kardex 2026</p>
        </div>
        <div className="flex gap-4">
           <select 
              value={selectedWarehouseId} 
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm font-bold text-sm focus:outline-none"
            >
              {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por producto..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-16 pr-6 py-6 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-semibold"
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm font-bold text-sm"
        >
          <option value="All">Todas las Categorías</option>
          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-[2.5rem] cyber-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Producto</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Categoría</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Stock Actual</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Valorización</th>
              {user.role === Role.MASTER && <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-[0.2em] text-right">Ajuste Manual</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(item => (
              <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Package size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{item.product.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {item.product.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-[900] ${item.quantity < 50 ? 'text-rose-500' : 'text-slate-800'}`}>
                      {item.quantity}
                    </span>
                    {item.quantity < 50 && <AlertTriangle size={16} className="text-rose-500" />}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-mono text-sm font-black text-slate-400">
                    ${(item.quantity * item.product.acquisitionCost).toLocaleString()}
                  </span>
                </td>
                {user.role === Role.MASTER && (
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onAdjust(item.productId, selectedWarehouseId, -10)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <button 
                        onClick={() => onAdjust(item.productId, selectedWarehouseId, 10)}
                        className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
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
  );
};

export default Inventory;
