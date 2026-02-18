
import React, { useState } from 'react';
import { Users, Search, QrCode, DollarSign, ChevronRight, UserPlus, MapPin, Wallet, Mail, Phone, Briefcase, UserCheck } from 'lucide-react';
import { AppData, User, Role, Customer } from '../types';

interface CustomersProps {
  data: AppData;
  user: User;
  onUpdateBalance: (customerId: string, amount: number) => void;
}

const Customers: React.FC<CustomersProps> = ({ data, user, onUpdateBalance }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const filtered = data.customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.manager.toLowerCase().includes(search.toLowerCase()) ||
    c.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handlePayment = () => {
    if (!selectedCustomer || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    onUpdateBalance(selectedCustomer.id, amount);
    setPaymentAmount('');
    setSelectedCustomer(null);
    alert('Abono registrado con éxito');
  };

  const generateQR = (customer: Customer) => {
    alert(`Generando Código QR para: ${customer.name}\nZona: ${customer.zone}`);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">BASE DE CLIENTES</h2>
          <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-[0.2em]">Feria Tabasco 2026 - Control de Concesiones</p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-blue-100 hover:scale-105 transition-all">
          <UserPlus size={20} /> ALTA DE COMERCIO
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por comercio, encargado o zona operativa..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white pl-16 pr-6 py-6 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-semibold"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white p-8 rounded-[2.5rem] cyber-shadow flex flex-col gap-6 group transition-all duration-300 hover:border-blue-200 border border-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 leading-tight">{customer.tradeName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{customer.zone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Saldo Actual</p>
                <p className={`text-2xl font-[900] ${customer.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  ${customer.balance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <UserCheck size={16} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Encargado</p>
                  <p className="text-xs font-bold text-slate-700 uppercase">{customer.manager}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Giro</p>
                  <p className="text-xs font-bold text-slate-700">{customer.businessLine}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Contacto</p>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Teléfono</p>
                  <p className="text-xs font-bold text-slate-700">{customer.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setSelectedCustomer(customer)}
                className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Registrar Abono
              </button>
              <button 
                onClick={() => generateQR(customer)}
                className="p-4 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
              >
                <QrCode size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Aplicar Pago</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-slate-400">×</button>
              </div>
              <p className="text-slate-400 font-medium italic">Abonando a cuenta de: <span className="text-slate-900 font-bold not-italic">{selectedCustomer.tradeName}</span></p>
              
              <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-slate-100">
                <span className="text-slate-500 font-bold">Deuda Pendiente</span>
                <span className="text-2xl font-black text-rose-500">${selectedCustomer.balance.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Monto del Depósito</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 pl-10 pr-6 py-4 rounded-2xl border border-slate-100 font-black text-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-4 mt-4"
              >
                CONFIRMAR ABONO
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
