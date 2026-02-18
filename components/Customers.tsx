
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  QrCode, 
  DollarSign, 
  ChevronRight, 
  UserPlus, 
  MapPin, 
  Wallet, 
  Mail, 
  Phone, 
  Briefcase, 
  UserCheck,
  Download,
  X,
  Printer
} from 'lucide-react';
import { AppData, User, Role, Customer } from '../types.ts';

interface CustomersProps {
  data: AppData;
  user: User;
  onUpdateBalance: (customerId: string, amount: number) => void;
}

const Customers: React.FC<CustomersProps> = ({ data, user, onUpdateBalance }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [qrModalCustomer, setQrModalCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const filtered = data.customers.filter(c => 
    c.tradeName.toLowerCase().includes(search.toLowerCase()) || 
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

  useEffect(() => {
    if (qrModalCustomer && qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      const qrData = JSON.stringify({
        id: qrModalCustomer.id,
        name: qrModalCustomer.tradeName,
        zone: qrModalCustomer.zone
      });
      
      // @ts-ignore
      new window.QRCode(qrContainerRef.current, {
        text: qrData,
        width: 180,
        height: 180,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: 1 
      });
    }
  }, [qrModalCustomer]);

  const downloadPDF = async () => {
    if (!qrModalCustomer || !qrContainerRef.current) return;
    const qrImage = qrContainerRef.current.querySelector('img')?.src;
    if (!qrImage) return;

    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] });
    doc.setFillColor(15, 23, 42); 
    doc.roundedRect(5, 5, 90, 140, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("SECURE SALES", 15, 20);
    doc.setFontSize(8);
    doc.text("FERIA TABASCO 2026", 15, 25);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 35, 70, 70, 3, 3, 'F');
    doc.addImage(qrImage, 'PNG', 20, 40, 60, 60);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(qrModalCustomer.tradeName.toUpperCase(), 15, 115, { maxWidth: 70 });
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`ZONA: ${qrModalCustomer.zone}`, 15, 125);
    doc.text(`ENCARGADO: ${qrModalCustomer.manager}`, 15, 130);
    doc.save(`Credencial_${qrModalCustomer.tradeName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-4 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Comercios</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Directorio de Concesiones 2026</p>
        </div>
        <button className="w-full md:w-auto bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 uppercase tracking-widest active:scale-95 transition-all">
          <UserPlus size={16} /> Alta Comercio
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Buscar comercio..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-100 font-bold text-xs outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pb-20 lg:pb-0">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-800 leading-tight truncate uppercase">{customer.tradeName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} className="text-blue-500" />
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter truncate">{customer.zone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Saldo</p>
                <p className={`text-sm lg:text-base font-black ${customer.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  ${customer.balance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-3 pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck size={12} className="text-slate-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-600 truncate uppercase">{customer.manager}</p>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Phone size={12} className="text-slate-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-600 truncate">{customer.phone}</p>
              </div>
              <div className="flex items-center gap-2 min-w-0 col-span-2">
                <Mail size={12} className="text-slate-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-600 truncate">{customer.email}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => setSelectedCustomer(customer)}
                className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                Abonar
              </button>
              <button 
                onClick={() => setQrModalCustomer(customer)}
                className="px-4 py-3 bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white rounded-xl active:scale-95 transition-all"
              >
                <QrCode size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modales Optimizados */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 uppercase">Abonar a Cuenta</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 p-2"><X size={20}/></button>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pendiente</p>
                <p className="text-xl font-black text-rose-500">${selectedCustomer.balance.toLocaleString()}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Monto Depósito</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100 font-black text-lg focus:bg-white outline-none transition-all"
                />
              </div>
              <button onClick={handlePayment} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-50 mt-2">
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {qrModalCustomer && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-3">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 flex flex-col items-center">
              <div className="flex justify-between w-full mb-4 items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase">Credencial Digital</h3>
                <button onClick={() => setQrModalCustomer(null)} className="p-2 bg-slate-100 rounded-full"><X size={16}/></button>
              </div>
              <div className="w-full bg-slate-900 rounded-[1.5rem] p-5 text-white mb-6">
                 <div className="flex flex-col items-center justify-center mb-5">
                    <div className="bg-white p-3 rounded-2xl">
                       <div ref={qrContainerRef}></div>
                    </div>
                    <p className="mt-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">ID: {qrModalCustomer.id}</p>
                 </div>
                 <h4 className="text-base font-black truncate text-center mb-3">{qrModalCustomer.tradeName}</h4>
                 <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase">Zona</p>
                      <p className="text-[10px] font-bold text-blue-400 truncate">{qrModalCustomer.zone}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase">Encargado</p>
                      <p className="text-[10px] font-bold text-slate-300 truncate">{qrModalCustomer.manager}</p>
                    </div>
                 </div>
              </div>
              <button onClick={downloadPDF} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <Download size={16} /> PDF Imprimible
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
