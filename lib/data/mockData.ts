import { 
  Product, 
  Customer, 
  Order, 
  OrderItem, 
  User, 
  Feedback,
  TeaType, 
  OrderStatus, 
  UserRole,
  DashboardStats,
  LowStockItem,
  RecentOrder,
  ProductDto,
  OrderDto,
  CustomerDto
} from '@/types/entities';

// Sample Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ceylon Black Tea Premium',
    type: TeaType.BlackTea,
    description: 'Premium high-grown Ceylon black tea with rich flavor and aroma from the hills of Deniyaya',
    price: 1250.00,
    quantityInStock: 45,
    reorderLevel: 10,
    unit: 'g',
    imageUrl: '/products/ceylon-black.jpg',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '2',
    name: 'Green Tea Supreme',
    type: TeaType.GreenTea,
    description: 'Fresh green tea leaves with delicate aroma and natural antioxidants',
    price: 1550.00,
    quantityInStock: 8, // Low stock
    reorderLevel: 15,
    unit: 'g',
    imageUrl: '/products/green-supreme.jpg',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-22T14:15:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '3',
    name: 'White Tea Delicate',
    type: TeaType.WhiteTea,
    description: 'Subtle and refined white tea with light color and gentle flavor',
    price: 2200.00,
    quantityInStock: 25,
    reorderLevel: 8,
    unit: 'g',
    imageUrl: '/products/white-delicate.jpg',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '4',
    name: 'Earl Grey Classic',
    type: TeaType.FlavoredTea,
    description: 'Traditional Earl Grey with bergamot oil and cornflower petals',
    price: 1350.00,
    quantityInStock: 6, // Low stock
    reorderLevel: 12,
    unit: 'g',
    imageUrl: '/products/earl-grey.jpg',
    createdAt: '2024-01-20T07:30:00Z',
    updatedAt: '2024-01-28T09:20:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '5',
    name: 'Chamomile Herbal Blend',
    type: TeaType.HerbalTea,
    description: 'Soothing chamomile blend perfect for relaxation and evening tea',
    price: 980.00,
    quantityInStock: 32,
    reorderLevel: 10,
    unit: 'g',
    imageUrl: '/products/chamomile.jpg',
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-30T11:10:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '6',
    name: 'Oolong Dragon Well',
    type: TeaType.OolongTea,
    description: 'Semi-fermented oolong tea with complex flavor profile',
    price: 1850.00,
    quantityInStock: 4, // Low stock
    reorderLevel: 10,
    unit: 'g',
    imageUrl: '/products/oolong-dragon.jpg',
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-02-01T13:25:00Z',
    isActive: true,
    isDeleted: false
  }
];

// Sample Customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Saman Perera',
    phone: '+94771234567',
    email: 'saman.perera@email.com',
    address: 'No. 45, Galle Road, Colombo 03',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '2',
    name: 'Kumari Silva',
    phone: '+94779876543',
    email: 'kumari.silva@email.com',
    address: 'No. 128, Kandy Road, Peradeniya',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '3',
    name: 'Rajesh Fernando',
    phone: '+94765432109',
    email: 'rajesh.fernando@email.com',
    address: 'No. 67, Main Street, Negombo',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-25T11:20:00Z',
    isActive: true,
    isDeleted: false
  }
];

// Sample Users (Staff)
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@deniyaya.com',
    passwordHash: 'hashedpassword123',
    name: 'Nimal Bandara',
    role: UserRole.Admin,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '2',
    email: 'manager@deniyaya.com',
    passwordHash: 'hashedpassword456',
    name: 'Priya Jayasinghe',
    role: UserRole.Manager,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isActive: true,
    isDeleted: false
  }
];

// Sample Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'DTN-20240203-001',
    customerId: '1',
    userId: '1',
    status: OrderStatus.Completed,
    totalAmount: 3750.00,
    notes: 'Customer requested extra packaging',
    createdAt: '2024-02-03T09:30:00Z',
    updatedAt: '2024-02-03T14:45:00Z',
    isActive: true,
    isDeleted: false,
    orderItems: []
  },
  {
    id: '2',
    orderNumber: 'DTN-20240203-002',
    customerId: '2',
    userId: '2',
    status: OrderStatus.Processing,
    totalAmount: 2700.00,
    notes: 'Rush order - needed by evening',
    createdAt: '2024-02-03T11:15:00Z',
    updatedAt: '2024-02-03T15:20:00Z',
    isActive: true,
    isDeleted: false,
    orderItems: []
  },
  {
    id: '3',
    orderNumber: 'DTN-20240203-003',
    customerId: '3',
    userId: '1',
    status: OrderStatus.Pending,
    totalAmount: 1850.00,
    createdAt: '2024-02-03T13:45:00Z',
    updatedAt: '2024-02-03T13:45:00Z',
    isActive: true,
    isDeleted: false,
    orderItems: []
  }
];

// Sample Order Items
export const mockOrderItems: OrderItem[] = [
  {
    id: '1',
    orderId: '1',
    productId: '1',
    quantity: 2,
    price: 1250.00,
    createdAt: '2024-02-03T09:30:00Z',
    updatedAt: '2024-02-03T09:30:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '2',
    orderId: '1',
    productId: '3',
    quantity: 1,
    price: 2200.00,
    createdAt: '2024-02-03T09:30:00Z',
    updatedAt: '2024-02-03T09:30:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '3',
    orderId: '2',
    productId: '2',
    quantity: 1,
    price: 1550.00,
    createdAt: '2024-02-03T11:15:00Z',
    updatedAt: '2024-02-03T11:15:00Z',
    isActive: true,
    isDeleted: false
  }
];

// Sample Feedback
export const mockFeedback: Feedback[] = [
  {
    id: '1',
    customerId: '1',
    rating: 5,
    comment: 'Excellent quality Ceylon tea! The flavor is outstanding and delivery was prompt.',
    createdAt: '2024-02-04T10:00:00Z',
    updatedAt: '2024-02-04T10:00:00Z',
    isActive: true,
    isDeleted: false
  },
  {
    id: '2',
    customerId: '2',
    rating: 4,
    comment: 'Great tea selection. The green tea was fresh and aromatic.',
    createdAt: '2024-02-05T14:30:00Z',
    updatedAt: '2024-02-05T14:30:00Z',
    isActive: true,
    isDeleted: false
  }
];

// Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  lowStockItems: mockProducts.filter(p => p.quantityInStock <= p.reorderLevel).length,
  todayOrders: 3,
  todayRevenue: 8300.00,
  totalCustomers: mockCustomers.length,
  pendingOrders: mockOrders.filter(o => o.status === OrderStatus.Pending).length
};

// Low Stock Items
export const mockLowStockItems: LowStockItem[] = mockProducts
  .filter(p => p.quantityInStock <= p.reorderLevel)
  .map(p => ({
    id: p.id,
    name: p.name,
    currentStock: p.quantityInStock,
    reorderLevel: p.reorderLevel,
    type: p.type
  }));

// Recent Orders
export const mockRecentOrders: RecentOrder[] = mockOrders
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5)
  .map(order => {
    const customer = mockCustomers.find(c => c.id === order.customerId);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: customer?.name,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
    };
  });

// Helper functions to get formatted data
export const getProductsDto = (): ProductDto[] => {
  return mockProducts.map(p => ({
    id: p.id,
    name: p.name,
    type: p.type,
    description: p.description,
    price: p.price,
    quantityInStock: p.quantityInStock,
    reorderLevel: p.reorderLevel,
    unit: p.unit,
    imageUrl: p.imageUrl,
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  }));
};

export const getCustomersDto = (): CustomerDto[] => {
  return mockCustomers.map(c => {
    const customerOrders = mockOrders.filter(o => o.customerId === c.id);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastOrder = customerOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      totalOrders: customerOrders.length,
      totalSpent: totalSpent,
      lastOrderDate: lastOrder?.createdAt,
      createdAt: c.createdAt
    };
  });
};

export const getOrdersDto = (): OrderDto[] => {
  return mockOrders.map(order => {
    const customer = mockCustomers.find(c => c.id === order.customerId);
    const orderItems = mockOrderItems.filter(oi => oi.orderId === order.id);
    
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: customer?.name,
      customerPhone: customer?.phone,
      customerEmail: customer?.email,
      status: order.status,
      totalAmount: order.totalAmount,
      notes: order.notes,
      createdAt: order.createdAt,
      orderItems: orderItems.map(oi => {
        const product = mockProducts.find(p => p.id === oi.productId);
        return {
          id: oi.id,
          productName: product?.name || 'Unknown Product',
          quantity: oi.quantity,
          price: oi.price,
          totalPrice: oi.quantity * oi.price
        };
      })
    };
  });
};