import { UserRole } from './entities';

export interface NavItem {
  name: string;
  href: string;
  icon: string; // We'll use icon names as strings for now
  requiredRoles?: UserRole[];
  badge?: number;
  subItems?: NavItem[];
}

export interface NavigationState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}