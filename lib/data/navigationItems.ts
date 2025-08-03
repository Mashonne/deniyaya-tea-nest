import { NavItem } from '@/types/navigation';
import { UserRole } from '@/types/entities';

export const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'home'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: 'cube',
    subItems: [
      { name: 'All Products', href: '/admin/products/list', icon: 'list' },
      { name: 'Add Product', href: '/admin/products/add', icon: 'plus' },
      { name: 'Low Stock', href: '/admin/products/low-stock', icon: 'warning' }
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: 'shopping-bag',
    badge: 3, // This would come from actual data
    subItems: [
      { name: 'All Orders', href: '/admin/orders/list', icon: 'list' },
      { name: 'Pending Orders', href: '/admin/orders/pending', icon: 'clock' },
      { name: 'Create Order', href: '/admin/orders/new', icon: 'plus' }
    ]
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: 'users',
    subItems: [
      { name: 'All Customers', href: '/admin/customers/list', icon: 'list' },
      { name: 'Add Customer', href: '/admin/customers/add', icon: 'user-plus' }
    ]
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: 'archive',
    subItems: [
      { name: 'Stock Overview', href: '/admin/inventory/overview', icon: 'chart-bar' },
      { name: 'Stock Adjustments', href: '/admin/inventory/adjustments', icon: 'adjustments' },
      { name: 'Low Stock Alerts', href: '/admin/inventory/low-stock', icon: 'warning' }
    ]
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: 'chart-line',
    subItems: [
      { name: 'Sales Reports', href: '/admin/reports/sales', icon: 'chart-line' },
      { name: 'Inventory Reports', href: '/admin/reports/inventory', icon: 'chart-bar' },
      { name: 'Customer Analytics', href: '/admin/reports/customers', icon: 'users' }
    ]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: 'cog',
    requiredRoles: [UserRole.Admin, UserRole.Manager],
    subItems: [
      { name: 'Profile', href: '/admin/settings/profile', icon: 'user' },
      { 
        name: 'User Management', 
        href: '/admin/settings/users', 
        icon: 'users',
        requiredRoles: [UserRole.Admin]
      },
      { 
        name: 'System Settings', 
        href: '/admin/settings/system', 
        icon: 'cog',
        requiredRoles: [UserRole.Admin]
      }
    ]
  }
];

// Helper function to get filtered navigation items based on user role
export function getFilteredNavigationItems(userRole: UserRole): NavItem[] {
  return navigationItems.filter(item => {
    // If no required roles specified, show to everyone
    if (!item.requiredRoles) return true;
    
    // Check if user role is in required roles
    return item.requiredRoles.includes(userRole);
  }).map(item => ({
    ...item,
    subItems: item.subItems?.filter(subItem => {
      if (!subItem.requiredRoles) return true;
      return subItem.requiredRoles.includes(userRole);
    })
  }));
}