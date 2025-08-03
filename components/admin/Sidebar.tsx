'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types/navigation';
import { getFilteredNavigationItems } from '@/lib/data/navigationItems';
import { UserRole } from '@/types/entities';
import Icon from './Icon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

// Extract NavItem component outside to prevent recreation
const NavItemComponent = memo(({ 
  item, 
  isSubItem = false,
  isActive,
  isExpanded,
  onToggle,
  onClose
}: { 
  item: NavItem; 
  isSubItem?: boolean;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <li>
      <div>
        {hasSubItems ? (
          <button
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.name}`}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive || isExpanded
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
            } ${isSubItem ? 'ml-6 pl-3' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item.icon} 
                className={`h-5 w-5 ${isActive || isExpanded ? 'text-white' : 'text-gray-500'}`} 
              />
              <span>{item.name}</span>
              {item.badge && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {item.badge}
                </span>
              )}
            </div>
            <Icon 
              name={isExpanded ? 'chevron-down' : 'chevron-right'} 
              className={`h-4 w-4 transition-transform duration-200 ${
                isActive || isExpanded ? 'text-white' : 'text-gray-400'
              }`} 
            />
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
            } ${isSubItem ? 'ml-6 pl-3' : ''}`}
          >
            <Icon 
              name={item.icon} 
              className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} 
            />
            <span>{item.name}</span>
            {item.badge && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {item.badge}
              </span>
            )}
          </Link>
        )}
      </div>

      {hasSubItems && isExpanded && (
        <ul className="mt-2 space-y-1" role="group">
          {item.subItems?.map((subItem) => (
            <NavItemComponent 
              key={subItem.name} 
              item={subItem} 
              isSubItem 
              isActive={false} // You'll need to pass this from parent
              isExpanded={false}
              onToggle={() => {}}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

NavItemComponent.displayName = 'NavItemComponent';

export default function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-expanded-items');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  const navigationItems = useMemo(() => {
    try {
      return getFilteredNavigationItems(userRole);
    } catch (error) {
      console.error('Error loading navigation items:', error);
      return [];
    }
  }, [userRole]);

  // Persist expanded items to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems));
  }, [expandedItems]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      const firstLink = document.querySelector('.sidebar-nav a, .sidebar-nav button');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }
  }, [isOpen]);

  const toggleExpanded = useCallback((itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? [] // Close the currently expanded item
        : [itemName] // Open only the clicked item, closing all others
    );
  }, []);

  const isActiveLink = useCallback((href: string) => {
    // More precise matching to avoid false positives
    if (href === pathname) return true;
    if (href === '/admin/dashboard') return false; // Don't match dashboard with other routes
    
    // Check if current path is a sub-route of href
    const hrefSegments = href.split('/').filter(Boolean);
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (hrefSegments.length > pathSegments.length) return false;
    
    return hrefSegments.every((segment, index) => segment === pathSegments[index]);
  }, [pathname]);

  // Memoized computation of active states
  const activeStates = useMemo(() => {
    const states = new Map();
    
    navigationItems.forEach(item => {
      const isActive = isActiveLink(item.href);
      const hasActiveSubItem = item.subItems?.some(subItem => isActiveLink(subItem.href)) || false;
      const isExpanded = expandedItems.includes(item.name) || hasActiveSubItem;
      
      states.set(item.name, { isActive, isExpanded, hasActiveSubItem });
      
      item.subItems?.forEach(subItem => {
        states.set(subItem.name, { isActive: isActiveLink(subItem.href), isExpanded: false });
      });
    });
    
    return states;
  }, [navigationItems, expandedItems, isActiveLink]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Deniyaya Tea</p>
              <p className="text-xs text-green-600">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-nav">
          <ul className="space-y-1" role="list">
            {navigationItems.map((item) => {
              const state = activeStates.get(item.name) || { isActive: false, isExpanded: false };
              
              return (
                <NavItemComponent 
                  key={item.name} 
                  item={item}
                  isActive={state.isActive}
                  isExpanded={state.isExpanded}
                  onToggle={() => toggleExpanded(item.name)}
                  onClose={onClose}
                />
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="user" className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userRole} User
              </p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}