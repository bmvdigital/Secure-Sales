
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
  X,
  CreditCard
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
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-[900] text-slate-900 tracking-tight">VENTAS</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-[10px] tracking-[0.2em]">Facturación Feria 2026</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
            <Package size={16} className="text-blue-500" />
            <select 
              value={selectedWarehouseId} 
              onChange={(e) => {
                setSelectedWarehouseId(e.target.value);
                setCart([]);
              }}
              className="bg-transparent font-bold text-xs focus:outline-none flex-1 truncate"
            >
              {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
            <User size={16} className="text-blue-500" />
            <select 
              value={selectedCustomerId} 
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-bold text-xs focus:outline-none flex-1 truncate"
            >
              {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-1 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const inv = data.inventory.find(i => i.productId === product.id && i.warehouseId === selectedWarehouseId);
                const isOutOfStock = !inv || inv.quantity <= 0;
                
                return (
                  <button
                    key={product.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                    className={`bg-white p-5 rounded-[1.5rem] border border-slate-100 text-left transition-all duration-300 group ${
                      isOutOfStock ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 bg-slate-50 text-[8px] font-black uppercase tracking-tighter text-slate-400 rounded">
                        {product.category}
                      </span>
                      <span className={`text-[10px] font-black ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        {inv?.quantity || 0} UNI
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-3 truncate">{product.name}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-[900] text-blue-600">${product.salePrice.toLocaleString()}</span>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plus size={14} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart Container - Responsive Drawer / Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 right-0 z-50 w-full sm:w-[400px] lg:w-[380px]
          bg-white lg:rounded-[2rem] lg:cyber-shadow flex flex-col overflow-hidden transition-transform duration-300
          ${cartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 bg-slate-900 text-white shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-blue-400" />
              <h3 className="text-lg font-black tracking-tight">ORDEN ACTUAL</h3>
            </div>
            <button onClick={() => setCartOpen(false)} className="lg:hidden text-slate-400"><X /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
                <ShoppingCart size={48} strokeWidth={1} />
                <p className="font-bold text-center text-xs">CARRITO VACÍO</p>
              </div>
            ) : (
              cart.map(item => {
                const product = data.products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-black text-slate-800 truncate">{product?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">${item.price} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:text-blue-600"><Minus size={14}/></button>
                       <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:text-blue-600"><Plus size={14}/></button>
                       <button onClick={() => removeFromCart(item.productId)} className="ml-2 p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14}/></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CONTADO)}
                className={`py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === PaymentMethod.CONTADO ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <span className="text-[10px] font-black uppercase">Contado</span>
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CONSIGNACION)}
                className={`py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === PaymentMethod.CONSIGNACION ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <span className="text-[10px] font-black uppercase">Crédito</span>
              </button>
            </div>

            <div className="flex justify-between items-end mb-6">
               <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
               <span className="text-3xl font-[900] text-slate-900 tracking-tighter">${total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              PAGAR AHORA
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Cart Button Mobile */}
      <button 
        onClick={() => setCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </button>

      {/* Ticket Modal */}
      {showTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Venta Registrada</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {showTicket.id}</p>
            </div>
            
            <div className="px-6 py-4 border-y border-dashed border-slate-200 font-mono text-[11px] space-y-2">
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="font-bold truncate max-w-[150px]">{data.customers.find(c => c.id === showTicket.customerId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Pago:</span>
                <span className="font-bold">{showTicket.paymentMethod}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 max-h-32 overflow-y-auto pr-1">
                {showTicket.items.map((item, idx) => {
                  const p = data.products.find(prod => prod.id === item.productId);
                  return (
                    <div key={idx} className="flex justify-between mb-1">
                      <span className="truncate flex-1 pr-2">{item.quantity}x {p?.name}</span>
                      <span>${(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
                <span>TOTAL:</span>
                <span>${showTicket.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <button 
                onClick={() => window.print()}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer size={14} /> IMPRIMIR RECIBO
              </button>
              <button 
                onClick={() => setShowTicket(null)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Nueva Operación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
