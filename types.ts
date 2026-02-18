
export enum Role {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  PROMOTOR = 'PROMOTOR'
}

export enum Category {
  HIELO = 'Hielo',
  CERVEZA = 'Cerveza',
  REFRESCO = 'Refresco',
  LICOR = 'Licor'
}

export enum PaymentMethod {
  CONTADO = 'Contado',
  CONSIGNACION = 'Consignación'
}

export enum OrderStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado'
}

export enum TransferStatus {
  EN_CAMINO = 'En Camino',
  RECIBIDO = 'Recibido'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  acquisitionCost: number;
  salePrice: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  zone: string;
  balance: number;
  tradeName: string;
  businessLine: string;
  email: string;
  phone: string;
  manager: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  warehouseId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  operatorId: string;
}

export interface Order {
  id: string;
  date: string;
  customerId: string;
  items: SaleItem[];
  total: number;
  status: OrderStatus;
  promoterId: string;
}

export interface Transfer {
  id: string;
  date: string;
  originWarehouseId: string;
  destinationWarehouseId: string;
  productId: string;
  quantity: number;
  status: TransferStatus;
}

export interface AppData {
  products: Product[];
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  customers: Customer[];
  sales: Sale[];
  orders: Order[];
  transfers: Transfer[];
}

export interface User {
  id: string;
  username: string;
  role: Role;
}
