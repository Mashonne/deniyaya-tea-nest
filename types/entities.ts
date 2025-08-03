// Enums based on C# entities
export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager', 
  Staff = 'Staff'
}

export enum TeaType {
  BlackTea = 'BlackTea',
  GreenTea = 'GreenTea',
  WhiteTea = 'WhiteTea',
  HerbalTea = 'HerbalTea',
  OolongTea = 'OolongTea',
  FlavoredTea = 'FlavoredTea',
  Other = 'Other'
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// Base Entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

// Product entity
export interface Product extends BaseEntity {
  name: string;
  type: TeaType;
  description?: string;
  price: number;
  quantityInStock: number;
  reorderLevel: number;
  unit: string;
  imageUrl?: string;
  orderItems?: OrderItem[];
}

// User entity
export interface User extends BaseEntity {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  orders?: Order[];
}

// Customer entity
export interface Customer extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  orders?: Order[];
  feedbacks?: Feedback[];
}

// Order entity
export interface Order extends BaseEntity {
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  userId: string;
  user?: User;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  orderItems: OrderItem[];
}

// OrderItem entity
export interface OrderItem extends BaseEntity {
  orderId: string;
  order?: Order;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

// Feedback entity
export interface Feedback extends BaseEntity {
  customerId: string;
  customer?: Customer;
  rating: number; // 1-5 stars
  comment?: string;
}

// DTO types for API responses
export interface ProductDto {
  id: string;
  name: string;
  type: TeaType;
  description?: string;
  price: number;
  quantityInStock: number;
  reorderLevel: number;
  unit: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CustomerDto {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  todayOrders: number;
  todayRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
}

export interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  type: TeaType;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}