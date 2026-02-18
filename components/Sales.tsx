
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  Printer,
  Minus,
  Plus,
  Package,
  User,
  X
} from 'lucide-react';
import { AppData, User as UserType, Role, Category, PaymentMethod, SaleItem, Sale } from '../types.ts';

interface SalesProps {
  data: AppData;
  user: UserType;
  onAddSale: (sale: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ data, user, onAddSale }) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(data.warehouses[0].id);
  const [selectedCustomerId, setSelectedCustomerId] = useState(data.customers[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CONTADO);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [showTicket, setShowTicket] = useState<Sale | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return data.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [data.products, search]);

  const addToCart = (productId: string) => {
    const existing = cart.find(i => i.productId === productId);
    const product = data.products.find(p => p.id === productId);
    const inventory = data.inventory.find(i => i.productId === productId && i.warehouseId === selectedWarehouseId);
    
    if (!product || !inventory) return;
    
    const currentQtyInCart = existing?.quantity || 0;
    if (currentQtyInCart + 1 > inventory.quantity) {
      alert('Sin stock suficiente');
      return;
    }

    if (existing) {
      setCart(cart.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { productId, quantity: 1, price: product.salePrice }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const inventory = data.inventory.find(i => i.productId === productId && i.warehouseId === selectedWarehouseId);
    if (delta > 0 && inventory && item.quantity + 1 > inventory.quantity) {
      alert('Sin stock suficiente');
      return;
    }

    if (item.quantity + delta <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i));
    }
  };

  const total = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    if (user.role === Role.ADMIN) {
      alert('Modo Lectura');
      return;
    }

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      customerId: selectedCustomerId,
      warehouseId: selectedWarehouseId,
      items: [...cart],
      total,
      paymentMethod,
      operatorId: user.id
    };

    onAddSale(newSale);
    setShowTicket(newSale);
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 relative">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Terminal</h2>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-0.5">Venta Directa 2026</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
            <Package size={14} className="text-blue-500 shrink-0" />
            <select 
              value={selectedWarehouseId} 
              onChange={(e) => { setSelectedWarehouseId(e.target.value); setCart([]); }}
              className="bg-transparent font-black text-[10px] uppercase focus:outline-none flex-1 truncate outline-none"
            >
              {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
            <User size={14} className="text-blue-500 shrink-0" />
            <select 
              value={selectedCustomerId} 
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-black text-[10px] uppercase focus:outline-none flex-1 truncate outline-none"
            >
              {data.customers.map(c => <option key={c.id} value={c.id}>{c.tradeName}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Producto..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 font-bold text-[11px] outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-1 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredProducts.map(product => {
                const inv = data.inventory.find(i => i.productId === product.id && i.warehouseId === selectedWarehouseId);
                const isOutOfStock = !inv || inv.quantity <= 0;
                
                return (
                  <button
                    key={product.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                    className={`bg-white p-3.5 rounded-2xl border border-slate-100 text-left transition-all group ${
                      isOutOfStock ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-95'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-1.5 py-0.5 bg-slate-50 text-[7px] font-black uppercase tracking-tighter text-slate-400 rounded">
                        {product.category}
                      </span>
                      <span className={`text-[9px] font-black ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        {inv?.quantity || 0} U.
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] leading-tight mb-2 truncate uppercase">{product.name}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-base font-black text-blue-600">${product.salePrice.toLocaleString()}</span>
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white">
                        <Plus size={12} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`
          fixed lg:static inset-y-0 right-0 z-50 w-full sm:w-[380px]
          bg-white lg:rounded-[2rem] flex flex-col overflow-hidden transition-transform duration-300
          ${cartOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-5 bg-slate-900 text-white shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-blue-400" />
              <h3 className="text-sm font-black tracking-widest uppercase">Carrito</h3>
            </div>
            <button onClick={() => setCartOpen(false)} className="lg:hidden text-slate-400 p-1"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                <p className="font-black text-[10px] tracking-widest uppercase">Vacío</p>
              </div>
            ) : (
              cart.map(item => {
                const product = data.products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[10px] font-black text-slate-800 truncate uppercase">{product?.name}</p>
                      <p className="text-[9px] font-bold text-slate-400">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-slate-400 hover:text-blue-600"><Minus size={12}/></button>
                       <span className="font-black text-[11px] w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-slate-400 hover:text-blue-600"><Plus size={12}/></button>
                       <button onClick={() => removeFromCart(item.productId)} className="ml-1 p-1.5 text-rose-500 bg-rose-50 rounded-lg"><Trash2 size={12}/></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setPaymentMethod(PaymentMethod.CONTADO)} className={`py-2 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.CONTADO ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>Contado</button>
              <button onClick={() => setPaymentMethod(PaymentMethod.CONSIGNACION)} className={`py-2 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.CONSIGNACION ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>Crédito</button>
            </div>
            <div className="flex justify-between items-end mb-4">
               <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest">Total</span>
               <span className="text-2xl font-black text-slate-900">${total.toLocaleString()}</span>
            </div>
            <button onClick={handleCompleteSale} disabled={cart.length === 0} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white rounded-xl font-black shadow-lg transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              Pagar <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <div className="relative">
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[8px] font-black flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </button>

      {showTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] w-full max-w-xs overflow-hidden">
            <div className="p-5 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={24} /></div>
              <h3 className="text-base font-black text-slate-900 uppercase">Éxito</h3>
            </div>
            <div className="px-5 py-3 border-y border-dashed border-slate-200 font-mono text-[10px] space-y-1">
              <div className="flex justify-between"><span>Cliente:</span><span className="font-bold truncate max-w-[120px] uppercase">{data.customers.find(c => c.id === showTicket.customerId)?.tradeName}</span></div>
              <div className="flex justify-between border-t border-slate-50 pt-1 mt-1 font-bold text-slate-900"><span>TOTAL:</span><span>${showTicket.total.toLocaleString()}</span></div>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <button onClick={() => window.print()} className="w-full py-2.5 bg-slate-100 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2"><Printer size={12} /> IMPRIMIR</button>
              <button onClick={() => setShowTicket(null)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">NUEVA VENTA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
