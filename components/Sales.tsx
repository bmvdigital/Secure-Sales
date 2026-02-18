
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
  ChevronDown
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
    <div className="h-full flex flex-col gap-5 relative animate-in fade-in duration-500">
      {/* Configuration Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Terminal POS</h2>
          <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">Configuración de Punto de Venta</p>
        </div>
        
        {/* Improved Dropdowns Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Warehouse Selector Card */}
          <div className="bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Origen: Almacén / CEDIS</label>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Package size={16} />
              </div>
              <div className="relative flex-1 group">
                <select 
                  value={selectedWarehouseId} 
                  onChange={(e) => { setSelectedWarehouseId(e.target.value); setCart([]); }}
                  className="w-full bg-transparent font-black text-xs uppercase text-slate-800 outline-none cursor-pointer appearance-none pr-8"
                >
                  {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* Customer Selector Card */}
          <div className="bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Destinatario: Comercio</label>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <User size={16} />
              </div>
              <div className="relative flex-1 group">
                <select 
                  value={selectedCustomerId} 
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-transparent font-black text-xs uppercase text-slate-800 outline-none cursor-pointer appearance-none pr-8"
                >
                  {data.customers.map(c => <option key={c.id} value={c.id}>{c.tradeName}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0">
        {/* Products Grid Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 font-bold text-xs outline-none transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-1 pb-24 lg:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const inv = data.inventory.find(i => i.productId === product.id && i.warehouseId === selectedWarehouseId);
                const isOutOfStock = !inv || inv.quantity <= 0;
                
                return (
                  <button
                    key={product.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                    className={`bg-white p-4 rounded-2xl border border-slate-100 text-left transition-all group relative overflow-hidden ${
                      isOutOfStock ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-95 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400 rounded-md">
                        {product.category}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isOutOfStock ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {inv?.quantity || 0} U.
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] leading-tight mb-3 h-8 line-clamp-2 uppercase">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-blue-600">${product.salePrice.toLocaleString()}</span>
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Plus size={14} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Cart */}
        <div className={`
          fixed lg:static inset-y-0 right-0 z-[60] w-full sm:w-[400px]
          bg-white lg:rounded-[2.5rem] flex flex-col overflow-hidden transition-transform duration-300 border-l border-slate-100
          ${cartOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 bg-slate-900 text-white shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <ShoppingCart size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-[0.15em] uppercase leading-none">Checkout</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1.5">{cart.length} productos agregados</p>
              </div>
            </div>
            <button onClick={() => setCartOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide bg-slate-50/30">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <ShoppingCart size={48} className="opacity-20 mb-4" />
                <p className="font-black text-[10px] tracking-[0.3em] uppercase opacity-40">Carrito Vacío</p>
              </div>
            ) : (
              cart.map(item => {
                const product = data.products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-right-2 duration-300">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-[10px] font-black text-slate-800 truncate uppercase">{product?.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">${item.price.toLocaleString()} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-slate-500 hover:text-rose-600 transition-colors"><Minus size={12}/></button>
                        <span className="font-black text-[11px] w-6 text-center text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-slate-500 hover:text-blue-600 transition-colors"><Plus size={12}/></button>
                       </div>
                       <button onClick={() => removeFromCart(item.productId)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={14}/></button>
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
                className={`py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.CONTADO ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
              >
                Liquidación
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CONSIGNACION)} 
                className={`py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.CONSIGNACION ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
              >
                Crédito
              </button>
            </div>
            
            <div className="flex justify-between items-center mb-6 px-1">
               <div className="flex flex-col">
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">Importe Total</span>
                <span className="text-[8px] font-bold text-slate-400">Impuestos incluidos</span>
               </div>
               <span className="text-3xl font-black text-slate-900 tracking-tighter">${total.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCompleteSale} 
              disabled={cart.length === 0} 
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              FINALIZAR VENTA <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Cart */}
      <button 
        onClick={() => setCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[55] active:scale-90 transition-all ring-4 ring-blue-100"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 rounded-full border-2 border-white text-[9px] font-black flex items-center justify-center shadow-md animate-bounce">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </div>
      </button>

      {/* Ticket Success Modal */}
      {showTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden animate-in zoom-in fade-in duration-300 shadow-2xl">
            <div className="p-8 text-center bg-emerald-500 text-white">
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest">Venta Exitosa</h3>
              <p className="text-[10px] font-bold text-white/70 mt-1">Transacción procesada correctamente</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 font-mono text-[10px] space-y-2">
                <div className="flex justify-between items-center text-slate-500 uppercase font-black tracking-widest text-[8px]">
                  <span>Factura:</span>
                  <span>{showTicket.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-slate-200/50">
                  <span className="font-bold text-slate-600 uppercase">Cliente:</span>
                  <span className="font-black text-slate-800 truncate max-w-[150px] uppercase">
                    {data.customers.find(c => c.id === showTicket.customerId)?.tradeName}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-black text-slate-500 uppercase">Total Cobrado:</span>
                  <span className="text-lg font-black text-blue-600">${showTicket.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.print()} 
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 uppercase active:scale-95 transition-all"
                >
                  <Printer size={16} /> Imprimir Comprobante
                </button>
                <button 
                  onClick={() => setShowTicket(null)} 
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] tracking-widest uppercase active:scale-95 transition-all"
                >
                  Regresar a Terminal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
