# Admin Navigation Implementation Guide

## Overview
This document outlines the implementation of the complete admin navigation system for Deniyaya Tea Nest, including sidebar navigation, page routing, and feature access based on the C# entity structure.

## Navigation Structure

### Main Navigation Areas
```
/admin/
├── dashboard/          # Main dashboard (already implemented)
├── products/           # Product management
│   ├── list/          # Product list view
│   ├── add/           # Add new product
│   └── [id]/edit/     # Edit existing product
├── orders/            # Order management
│   ├── list/          # Order list view
│   ├── [id]/          # Order details view
│   └── new/           # Create new order
├── customers/         # Customer management
│   ├── list/          # Customer list view
│   ├── [id]/          # Customer profile view
│   └── add/           # Add new customer
├── inventory/         # Inventory management
│   ├── overview/      # Stock overview
│   ├── low-stock/     # Low stock alerts
│   └── adjustments/   # Stock adjustments
├── reports/           # Reports and analytics
│   ├── sales/         # Sales reports
│   ├── inventory/     # Inventory reports
│   └── customers/     # Customer analytics
└── settings/          # System settings
    ├── profile/       # User profile
    ├── users/         # User management (Admin only)
    └── system/        # System configuration
```

## Implementation Plan

### 1. Sidebar Navigation Component
**File**: `components/admin/Sidebar.tsx`

#### Features:
- Collapsible sidebar with icons and labels
- Active state indication
- Role-based menu items (Admin/Manager/Staff)
- Responsive design (mobile hamburger menu)
- Green theme integration

#### Navigation Items:
```typescript
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  requiredRole?: UserRole[];
  badge?: number; // For notifications
  subItems?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: CubeIcon,
    subItems: [
      { name: 'All Products', href: '/admin/products/list' },
      { name: 'Add Product', href: '/admin/products/add' },
      { name: 'Categories', href: '/admin/products/categories' }
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBagIcon,
    badge: pendingOrdersCount,
    subItems: [
      { name: 'All Orders', href: '/admin/orders/list' },
      { name: 'Pending', href: '/admin/orders/list?status=pending' },
      { name: 'Create Order', href: '/admin/orders/new' }
    ]
  },
  // ... more items
];
```

### 2. Layout Updates
**File**: `app/admin/layout.tsx`

#### Enhanced Layout:
- Sidebar integration
- Breadcrumb navigation
- Mobile responsive header
- User dropdown menu
- Notification center

### 3. Page Implementations

#### A. Product Management (`/admin/products/`)

##### Product List Page
**File**: `app/admin/products/list/page.tsx`

**Features:**
- Data table with search and filters
- Tea type filtering
- Stock level indicators
- Bulk actions (activate/deactivate)
- Export functionality
- Pagination

**UI Components:**
```typescript
- ProductTable
- SearchBar
- FilterDropdowns (TeaType, Stock Status)
- BulkActionToolbar
- AddProductButton
```

##### Add/Edit Product Page
**File**: `app/admin/products/add/page.tsx` & `app/admin/products/[id]/edit/page.tsx`

**Features:**
- Multi-step form (Basic Info → Pricing → Images)
- Image upload with preview
- Tea type selection
- Stock management
- Form validation with Zod
- Auto-save drafts

**Form Sections:**
1. Basic Information (Name, Description, Type)
2. Pricing & Inventory (Price, Stock, Reorder Level)
3. Images & Media (Product photos)
4. Additional Details (Origin, Brewing instructions)

#### B. Order Management (`/admin/orders/`)

##### Order List Page
**File**: `app/admin/orders/list/page.tsx`

**Features:**
- Order status filtering
- Date range picker
- Customer search
- Order status updates
- Print/export orders
- Real-time status updates

##### Order Details Page
**File**: `app/admin/orders/[id]/page.tsx`

**Features:**
- Complete order information
- Customer details
- Order items with product links
- Status timeline
- Payment information
- Print invoice
- Order actions (cancel, refund, etc.)

##### New Order Page
**File**: `app/admin/orders/new/page.tsx`

**Features:**
- Customer selection/creation
- Product search and add to cart
- Quantity adjustments
- Price calculations
- Payment method selection
- Order notes

#### C. Customer Management (`/admin/customers/`)

##### Customer List Page
**File**: `app/admin/customers/list/page.tsx`

**Features:**
- Customer search
- Contact information display
- Order history summary
- Customer analytics (total spent, frequency)
- Export customer data

##### Customer Profile Page
**File**: `app/admin/customers/[id]/page.tsx`

**Features:**
- Complete customer profile
- Order history
- Purchase patterns
- Contact information
- Notes and preferences
- Loyalty program status

#### D. Inventory Management (`/admin/inventory/`)

##### Inventory Overview
**File**: `app/admin/inventory/overview/page.tsx`

**Features:**
- Current stock levels
- Stock value calculations
- Low stock alerts
- Recent stock movements
- Inventory analytics charts

##### Stock Adjustments
**File**: `app/admin/inventory/adjustments/page.tsx`

**Features:**
- Manual stock adjustments
- Reason codes (damage, loss, correction)
- Batch stock updates
- Adjustment history
- Approval workflow

#### E. Reports & Analytics (`/admin/reports/`)

##### Sales Reports
**File**: `app/admin/reports/sales/page.tsx`

**Features:**
- Date range selection
- Sales charts and graphs
- Top products analysis
- Revenue trends
- Export to PDF/Excel

##### Inventory Reports
**File**: `app/admin/reports/inventory/page.tsx`

**Features:**
- Stock valuation reports
- Movement history
- Dead stock analysis
- Reorder recommendations

### 4. Common Components

#### Data Table Component
**File**: `components/admin/DataTable.tsx`

**Features:**
- Sortable columns
- Search functionality
- Pagination
- Row selection
- Custom cell renderers
- Export functionality

#### Form Components
**Files**: `components/admin/forms/`

**Components:**
- ProductForm
- OrderForm
- CustomerForm
- StockAdjustmentForm
- FormField wrapper components

#### UI Components
**Files**: `components/admin/ui/`

**Components:**
- StatusBadge
- ActionButton
- ConfirmDialog
- LoadingSpinner
- EmptyState
- Pagination

### 5. State Management

#### Context Providers
**Files**: `contexts/admin/`

**Contexts:**
- AdminContext (user, permissions)
- NotificationContext (alerts, messages)
- CartContext (for new orders)

#### Custom Hooks
**Files**: `hooks/admin/`

**Hooks:**
- useProducts (CRUD operations)
- useOrders (order management)
- useCustomers (customer operations)
- useInventory (stock management)

### 6. API Integration Structure

#### API Service Layer
**Files**: `lib/api/`

**Services:**
- ProductService
- OrderService
- CustomerService
- InventoryService
- ReportService

**Example Service:**
```typescript
export class ProductService {
  static async getProducts(params?: ProductListParams) {
    // API call implementation
  }
  
  static async createProduct(product: CreateProductDto) {
    // API call implementation
  }
  
  static async updateProduct(id: string, product: UpdateProductDto) {
    // API call implementation
  }
}
```

### 7. Responsive Design

#### Mobile Considerations:
- Collapsible sidebar for mobile
- Touch-friendly buttons and inputs
- Responsive data tables (horizontal scroll)
- Mobile-optimized forms
- Swipe gestures for actions

#### Tablet Optimizations:
- Medium-sized layouts
- Adaptive navigation
- Touch-optimized interactions

### 8. Security & Permissions

#### Role-Based Access Control:
```typescript
enum Permission {
  VIEW_PRODUCTS = 'view_products',
  CREATE_PRODUCTS = 'create_products',
  EDIT_PRODUCTS = 'edit_products',
  DELETE_PRODUCTS = 'delete_products',
  VIEW_ORDERS = 'view_orders',
  MANAGE_ORDERS = 'manage_orders',
  VIEW_CUSTOMERS = 'view_customers',
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_REPORTS = 'view_reports',
  MANAGE_USERS = 'manage_users',
  SYSTEM_SETTINGS = 'system_settings'
}

const rolePermissions = {
  [UserRole.Admin]: Object.values(Permission),
  [UserRole.Manager]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_REPORTS
  ],
  [UserRole.Staff]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_CUSTOMERS
  ]
};
```

### 9. Performance Optimizations

#### Data Loading:
- Lazy loading for large datasets
- Virtual scrolling for long lists
- Optimistic updates
- Caching frequently accessed data

#### Image Handling:
- Image compression and optimization
- Lazy loading product images
- Progressive image loading

### 10. Error Handling & UX

#### Error States:
- Network error handling
- Form validation errors
- Loading states
- Empty states
- 404 and error pages

#### User Feedback:
- Toast notifications
- Success/error messages
- Loading indicators
- Confirmation dialogs

## Implementation Priority

### Phase 1 (High Priority):
1. Sidebar navigation component
2. Product management (list, add, edit)
3. Order management (list, details)
4. Enhanced dashboard

### Phase 2 (Medium Priority):
1. Customer management
2. Inventory management
3. Basic reports
4. User management

### Phase 3 (Nice to Have):
1. Advanced analytics
2. System settings
3. Advanced reporting
4. Bulk operations

## Testing Strategy

### Component Testing:
- Unit tests for all components
- Form validation testing
- User interaction testing

### Integration Testing:
- API integration tests
- Navigation flow testing
- Permission-based access testing

### E2E Testing:
- Complete user workflows
- Mobile responsive testing
- Cross-browser testing

## Deployment Considerations

### Environment Setup:
- Development environment with mock data
- Staging environment for testing
- Production deployment strategy

### Monitoring:
- Error tracking
- Performance monitoring
- User analytics