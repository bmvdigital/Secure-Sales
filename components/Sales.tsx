
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
  MapPin,
  CreditCard
} from 'lucide-react';
import { AppData, User as UserType, Role, Category, PaymentMethod, SaleItem, Sale } from '../types';

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

  const filteredProducts = useMemo(() => {
    return data.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [data.products, search]);

  const addToCart = (productId: string) => {
    const existing = cart.find(i => i.productId === productId);
    const product = data.products.find(p => p.id === productId);
    const inventory = data.inventory.find(i => i.productId === productId && i.warehouseId === selectedWarehouseId);
    
    if (!product || !inventory) return;
    
    // Check stock
    const currentQtyInCart = existing?.quantity || 0;
    if (currentQtyInCart + 1 > inventory.quantity) {
      alert('Sin stock suficiente en este almacén');
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
      alert('Los administradores solo pueden ver (Modo Lectura)');
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
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">TERMINAL DE VENTAS</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Facturación y Despacho 2026</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <Package size={18} className="text-blue-500" />
            <select 
              value={selectedWarehouseId} 
              onChange={(e) => {
                setSelectedWarehouseId(e.target.value);
                setCart([]); // Clear cart if warehouse changes to avoid stock inconsistencies
              }}
              className="bg-transparent font-bold text-sm focus:outline-none"
            >
              {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <User size={18} className="text-blue-500" />
            <select 
              value={selectedCustomerId} 
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-bold text-sm focus:outline-none"
            >
              {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-10 overflow-hidden min-h-0">
        {/* Products Grid */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative mb-6">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar productos por nombre o categoría..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-16 pr-6 py-6 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {filteredProducts.map(product => {
                const inv = data.inventory.find(i => i.productId === product.id && i.warehouseId === selectedWarehouseId);
                const isOutOfStock = !inv || inv.quantity <= 0;
                
                return (
                  <button
                    key={product.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                    className={`bg-white p-6 rounded-[2rem] border border-slate-100 text-left transition-all duration-300 group ${
                      isOutOfStock ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 active:scale-95'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase tracking-tighter text-slate-400 rounded-lg">
                        {product.category}
                      </span>
                      <span className={`text-xs font-black ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        STOCK: {inv?.quantity || 0}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight mb-4">{product.name}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-[900] text-blue-600">${product.salePrice.toLocaleString()}</span>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plus size={18} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart / Checkout Sidebar */}
        <div className="w-[450px] bg-white rounded-[2.5rem] cyber-shadow flex flex-col overflow-hidden">
          <div className="p-8 bg-slate-900 text-white shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-blue-400" />
                <h3 className="text-xl font-black">CARRITO</h3>
              </div>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-black">{cart.length} ITEMS</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                <ShoppingCart size={64} strokeWidth={1} />
                <p className="font-bold text-center">El carrito está vacío.<br/>Seleccione productos para comenzar.</p>
              </div>
            ) : (
              cart.map(item => {
                const product = data.products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800">{product?.name}</p>
                      <p className="text-xs font-bold text-slate-400">${item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:text-blue-600"><Minus size={16}/></button>
                       <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:text-blue-600"><Plus size={16}/></button>
                       <button onClick={() => removeFromCart(item.productId)} className="ml-4 p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-8 border-t border-slate-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CONTADO)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CONTADO ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <DollarSign size={20} />
                <span className="text-xs font-black uppercase">Contado</span>
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CONSIGNACION)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CONSIGNACION ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <CreditCard size={20} />
                <span className="text-xs font-black uppercase">Crédito</span>
              </button>
            </div>

            <div className="flex justify-between items-end">
               <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total a pagar</span>
               <span className="text-4xl font-[900] text-slate-900">${total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-4 group"
            >
              FINALIZAR VENTA
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Venta Exitosa</h3>
              <p className="text-slate-400 font-medium">Folio: {showTicket.id}</p>
            </div>
            
            <div className="px-8 py-4 border-y border-dashed border-slate-200 font-mono text-sm space-y-2">
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="font-bold">{data.customers.find(c => c.id === showTicket.customerId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-bold">{showTicket.paymentMethod}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                {showTicket.items.map((item, idx) => {
                  const p = data.products.find(prod => prod.id === item.productId);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {p?.name.slice(0, 20)}...</span>
                      <span>${(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between pt-4 text-lg font-black">
                <span>TOTAL:</span>
                <span>${showTicket.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-8 flex gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Imprimir
              </button>
              <button 
                onClick={() => setShowTicket(null)}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black"
              >
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DollarSign = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default Sales;
