# Deniyaya Tea Nest - Frontend System Overview

## Project Description
Deniyaya Tea Nest is a frontend web application for a small family-owned tea shop located in Mirissa, Sri Lanka. This Next.js application provides the user interface for managing tea inventory and customer orders, replacing traditional notebook and paper records with a modern digital solution.

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context API / Zustand
- **Form Handling**: React Hook Form
- **Data Fetching**: Axios / Fetch API
- **Authentication**: NextAuth.js (frontend integration)
- **Styling**: MUI + CSS Modules

### Application Structure
```
/deniyaya-tea-nest/
├── app/
│   ├── (public)/        # Public-facing routes
│   │   ├── page.tsx     # Home page
│   │   ├── products/    # Product catalog
│   │   └── about/       # About page
│   ├── admin/           # Admin routes (protected)
│   │   ├── dashboard/   # Admin dashboard
│   │   ├── products/    # Product management
│   │   ├── orders/      # Order management
│   │   ├── customers/   # Customer management
│   │   └── reports/     # Reporting
│   ├── api/            # API route handlers (if needed)
│   └── layout.tsx      # Root layout
├── components/
│   ├── common/         # Shared components
│   ├── admin/          # Admin-specific components
│   └── public/         # Public-facing components
├── lib/
│   ├── api/           # API client functions
│   ├── utils/         # Utility functions
│   └── hooks/         # Custom React hooks
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## Frontend Pages & Features

### Public Routes

#### 1. Home Page (`/`)
- Welcome banner
- Featured products
- Shop introduction
- Contact information

#### 2. Products Page (`/products`)
- Product grid/list view
- Search and filter functionality
- Product categories
- Price sorting

#### 3. Product Detail Page (`/products/[id]`)
- Product images
- Detailed description
- Price and availability
- Related products

### Admin Routes (`/admin`)

#### 1. Dashboard (`/admin/dashboard`)
- **Key Metrics Cards**:
  - Total products
  - Low stock items
  - Today's orders
  - Revenue statistics
- **Quick Actions**:
  - Add new product
  - View recent orders
  - Generate reports
- **Charts & Visualizations**:
  - Sales trends
  - Popular products
  - Stock levels

#### 2. Product Management (`/admin/products`)
- **Product List**:
  - Sortable table view
  - Search functionality
  - Bulk actions
- **Add/Edit Product**:
  - Product form with validation
  - Image upload
  - Category selection
  - Pricing and stock management

#### 3. Order Management (`/admin/orders`)
- **Order List**:
  - Filter by status
  - Date range selection
  - Customer search
- **Order Details**:
  - Customer information
  - Order items
  - Status management
  - Print invoice

#### 4. Customer Management (`/admin/customers`)
- Customer list with search
- Customer profiles
- Order history
- Contact information

#### 5. Reports (`/admin/reports`)
- Sales reports
- Inventory reports
- Export to PDF/Excel
- Date range selection

## UI Components

### Common Components
- Header with navigation
- Footer
- Loading spinners
- Error boundaries
- Notification toasts
- Modal dialogs
- Data tables
- Form inputs

### Admin Components
- Sidebar navigation
- Stats cards
- Charts (Line, Bar, Pie)
- Data grids
- Action buttons
- Confirmation dialogs

## State Management
- **Global State**: User authentication, cart, theme
- **Local State**: Form data, UI toggles
- **Server State**: Product data, orders (cached)

## API Integration
The frontend communicates with a backend API for:
- Authentication
- Product CRUD operations
- Order management
- Customer data
- Reports generation

### API Endpoints (Expected)
```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id

GET    /api/customers
GET    /api/customers/:id

GET    /api/reports/sales
GET    /api/reports/inventory
```

## Security Considerations
- Protected routes with authentication
- API token management
- Input validation
- XSS prevention
- CORS configuration

## Performance Optimizations
- Image optimization with Next.js Image
- Lazy loading components
- Code splitting
- Static generation where possible
- Client-side caching

## Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interfaces
- Adaptive layouts