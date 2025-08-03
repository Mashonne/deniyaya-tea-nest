'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductsDto } from '@/lib/data/mockData';
import { TeaType } from '@/types/entities';
import Icon from '@/components/admin/Icon';

export default function InventoryLowStockPage() {
  const [products] = useState(getProductsDto());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TeaType | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const lowStockProducts = products.filter(product => {
    const isLowStock = product.quantityInStock <= product.reorderLevel;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    
    let matchesUrgency = true;
    if (urgencyFilter !== 'all') {
      const urgency = getUrgencyLevel(product.quantityInStock, product.reorderLevel);
      matchesUrgency = urgency.level === urgencyFilter;
    }
    
    return isLowStock && matchesSearch && matchesType && matchesUrgency;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getUrgencyLevel = (current: number, reorder: number) => {
    if (current === 0) return { 
      level: 'critical' as const, 
      label: 'Critical', 
      color: 'text-red-600 bg-red-50 border-red-200',
      priority: 4
    };
    if (current <= reorder * 0.3) return { 
      level: 'high' as const, 
      label: 'High', 
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      priority: 3
    };
    if (current <= reorder * 0.6) return { 
      level: 'medium' as const, 
      label: 'Medium', 
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      priority: 2
    };
    return { 
      level: 'medium' as const, 
      label: 'Low', 
      color: 'text-green-600 bg-green-50 border-green-200',
      priority: 1
    };
  };

  const getStockStatus = (current: number, reorder: number) => {
    if (current === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (current <= reorder) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const criticalItems = lowStockProducts.filter(p => p.quantityInStock === 0).length;
  const highUrgencyItems = lowStockProducts.filter(p => {
    const urgency = getUrgencyLevel(p.quantityInStock, p.reorderLevel);
    return urgency.level === 'high';
  }).length;
  const totalValue = lowStockProducts.reduce((sum, p) => sum + (p.quantityInStock * p.price), 0);

  // Sort by urgency priority
  const sortedProducts = [...lowStockProducts].sort((a, b) => {
    const urgencyA = getUrgencyLevel(a.quantityInStock, a.reorderLevel);
    const urgencyB = getUrgencyLevel(b.quantityInStock, b.reorderLevel);
    return urgencyB.priority - urgencyA.priority;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Low Stock Alerts</h1>
            <p className="text-gray-600">Products requiring immediate restocking attention</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/inventory/adjustments"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="adjustments" className="h-5 w-5" />
              <span>Adjust Stock</span>
            </Link>
            <Link
              href="/admin/inventory/overview"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="chart-bar" className="h-5 w-5" />
              <span>Full Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-red-900">{criticalItems}</h3>
              <p className="text-red-700">Critical (Out of Stock)</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-orange-900">{highUrgencyItems}</h3>
              <p className="text-orange-700">High Urgency</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="list" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-yellow-900">{lowStockProducts.length}</h3>
              <p className="text-yellow-700">Total Low Stock Items</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-bar" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-blue-900">{formatCurrency(totalValue)}</h3>
              <p className="text-blue-700">Affected Stock Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Search by name..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tea Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Tea Type
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TeaType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="all">All Types</option>
              {Object.values(TeaType).map(type => (
                <option key={type} value={type}>
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label htmlFor="urgency-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              id="urgency-filter"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as 'all' | 'critical' | 'high' | 'medium')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="all">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Low Stock Products ({sortedProducts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shortage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantityInStock, product.reorderLevel);
                const urgency = getUrgencyLevel(product.quantityInStock, product.reorderLevel);
                const shortage = Math.max(0, product.reorderLevel - product.quantityInStock);
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl">🍃</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.type} • {formatCurrency(product.price)}/{product.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        product.quantityInStock === 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.quantityInStock} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.reorderLevel} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        -{shortage} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href="/admin/inventory/adjustments"
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs"
                        >
                          Restock
                        </Link>
                        <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                          <Icon name="user" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="cube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No low stock items</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || urgencyFilter !== 'all' 
                ? 'No items match your current filters' 
                : 'All products are well stocked!'}
            </p>
            <Link
              href="/admin/inventory/overview"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              <Icon name="chart-bar" className="h-4 w-4" />
              <span>View All Inventory</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}