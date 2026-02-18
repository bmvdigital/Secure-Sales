
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Role, 
  AppData, 
  User, 
  OrderStatus, 
  TransferStatus,
  PaymentMethod,
  Category,
  Customer,
  Sale,
  Order,
  Transfer,
  InventoryItem,
  Product
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_WAREHOUSES, 
  INITIAL_CUSTOMERS, 
  INITIAL_INVENTORY, 
  BASE_SALES 
} from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Logistics from './components/Logistics';
import AuditLog from './components/AuditLog';
import Login from './components/Login';

const STORAGE_KEY = 'secure_sales_data';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('dashboard');
  const [data, setData] = useState<AppData>({
    products: INITIAL_PRODUCTS,
    warehouses: INITIAL_WAREHOUSES,
    inventory: INITIAL_INVENTORY,
    customers: INITIAL_CUSTOMERS,
    sales: BASE_SALES,
    orders: [],
    transfers: []
  });

  // Persistency
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const saveData = useCallback((newData: AppData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  // Actions
  const handleAddSale = (sale: Sale) => {
    if (user?.role === Role.ADMIN) return;
    
    const newData = { ...data };
    newData.sales = [sale, ...newData.sales];
    
    // Update inventory
    sale.items.forEach(item => {
      const invItem = newData.inventory.find(i => i.productId === item.productId && i.warehouseId === sale.warehouseId);
      if (invItem) invItem.quantity -= item.quantity;
    });

    // Update customer balance if consignment
    if (sale.paymentMethod === PaymentMethod.CONSIGNACION) {
      const customer = newData.customers.find(c => c.id === sale.customerId);
      if (customer) customer.balance += sale.total;
    }

    saveData(newData);
  };

  const handleUpdateBalance = (customerId: string, amount: number) => {
    if (user?.role === Role.ADMIN) return;
    const newData = { ...data };
    const customer = newData.customers.find(c => c.id === customerId);
    if (customer) {
      customer.balance -= amount;
      saveData(newData);
    }
  };

  const handleAddOrder = (order: Order) => {
    if (user?.role === Role.ADMIN) return;
    const newData = { ...data };
    newData.orders = [order, ...newData.orders];
    saveData(newData);
  };

  const handleProcessOrder = (orderId: string, status: OrderStatus) => {
    if (user?.role === Role.ADMIN) return;
    const newData = { ...data };
    const orderIdx = newData.orders.findIndex(o => o.id === orderId);
    if (orderIdx !== -1) {
      newData.orders[orderIdx].status = status;
      // If completed, potentially create a sale? 
      // For simplicity in MVP, we just change status.
      saveData(newData);
    }
  };

  const handleAddTransfer = (transfer: Transfer) => {
    if (user?.role === Role.ADMIN) return;
    const newData = { ...data };
    newData.transfers = [transfer, ...newData.transfers];
    
    // Debit origin warehouse
    const originInv = newData.inventory.find(i => i.productId === transfer.productId && i.warehouseId === transfer.originWarehouseId);
    if (originInv) originInv.quantity -= transfer.quantity;

    saveData(newData);
  };

  const handleReceiveTransfer = (transferId: string) => {
    if (user?.role === Role.ADMIN) return;
    const newData = { ...data };
    const transfer = newData.transfers.find(t => t.id === transferId);
    if (transfer && transfer.status === TransferStatus.EN_CAMINO) {
      transfer.status = TransferStatus.RECIBIDO;
      
      // Credit destination warehouse
      const destInv = newData.inventory.find(i => i.productId === transfer.productId && i.warehouseId === transfer.destinationWarehouseId);
      if (destInv) destInv.quantity += transfer.quantity;

      saveData(newData);
    }
  };

  const handleManualInventoryAdjustment = (productId: string, warehouseId: string, quantity: number) => {
    if (user?.role !== Role.MASTER) return; // Only master can adjust manually
    const newData = { ...data };
    const invItem = newData.inventory.find(i => i.productId === productId && i.warehouseId === warehouseId);
    if (invItem) {
      invItem.quantity += quantity;
      saveData(newData);
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'sales': return <Sales data={data} user={user} onAddSale={handleAddSale} />;
      case 'inventory': return <Inventory data={data} user={user} onAdjust={handleManualInventoryAdjustment} />;
      case 'orders': return <Orders data={data} user={user} onAddOrder={handleAddOrder} onProcess={handleProcessOrder} />;
      case 'customers': return <Customers data={data} user={user} onUpdateBalance={handleUpdateBalance} />;
      case 'logistics': return <Logistics data={data} user={user} onTransfer={handleAddTransfer} onReceive={handleReceiveTransfer} />;
      case 'audit': return <AuditLog data={data} />;
      default: return <Dashboard data={data} />;
    }
  };

  return (
    <Layout user={user} onLogout={() => setUser(null)} currentView={view} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
